package alg.classifiers;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.UserFunction;

import java.util.*;

/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Dmitry Divin
 */
public class ClassifierSimilarityFunctions {
    @UserFunction
    @Description("alg.classifiers.similar_l([1,2,3], [1.0,2.0,1.0], [2]) - comparison of classifiers by their features distances")
    public double similar_l(@Name("leftClassifiers") List<Long> leftClassifiers,
                          @Name("leftFeatures") List<Double> leftFeatures,
                          @Name("rightClassifiers") List<Long> rightClassifiers) {
        return similar(leftClassifiers, leftFeatures, rightClassifiers, rightClassifiers.stream().map(it -> 1.0).toList());
    }
    @UserFunction
    @Description("alg.classifiers.similar([1,2,3], [1.0,2.0,1.0], [2], [1.0]) - comparison of classifiers by their features distances")
    public double similar(@Name("leftClassifiers") List<Long> leftClassifiers,
                                  @Name("leftFeatures") List<Double> leftFeatures,
                                  @Name("rightClassifiers") List<Long> rightClassifiers,
                                  @Name("rightFeatures") List<Double> rightFeatures) {
        int leftClassifiersSize = leftClassifiers.size();
        int rightClassifiersSize = rightClassifiers.size();
        if (leftClassifiersSize == 0 || rightClassifiersSize == 0) {
            return 0.0;
        } else if (leftClassifiersSize != leftFeatures.size()) {
            throw new IllegalArgumentException(String.format("Length of leftClassifiers.length=%s should be equals with leftFeatures.length=%s", leftClassifiersSize, leftFeatures.size()));
        } else if (rightClassifiersSize != rightFeatures.size()) {
            throw new IllegalArgumentException(String.format("Length of rightClassifiers.length=%s should be equals with rightFeatures.length=%s", rightClassifiersSize, rightFeatures.size()));
        }

        Set<Long> unionClassifierSet = new HashSet<>(leftClassifiers);
        unionClassifierSet.addAll(rightClassifiers);
        Long[] unionClassifiers = new Long[unionClassifierSet.size()];
        unionClassifierSet.toArray(unionClassifiers);

        double[] leftVector = getFeaturesVector(leftClassifiers, leftFeatures, unionClassifiers);
        double[] rightVector = getFeaturesVector(rightClassifiers, rightFeatures, unionClassifiers);

        double result = cosine(leftVector, rightVector);
        if (Double.isNaN(result)) {
            return 0.0;
        }
        return result;
    }

    public double cosine(double[] vectorA, double[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0, k = vectorA.length; i < k; i++) {
            double valueA = vectorA[i];
            double valueB = vectorB[i];
            dotProduct += valueA * valueB;
            normA += Math.pow(valueA, 2);
            normB += Math.pow(valueB, 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    public double[] getFeaturesVector(List<Long> classifiers, List<Double> classifierFeatures, Long[] unionClassifiers) {
        Map<Long, Double> classifier2features = new HashMap<>();
        for (int i = 0, size = classifiers.size(); i < size; i++) {
            long classifier = classifiers.get(i);
            double features = classifierFeatures.get(i);
            classifier2features.put(classifier, features);
        }
        int vectorSize = unionClassifiers.length;
        double[] res = new double[vectorSize];
        for (int i = 0; i < vectorSize; i++) {
            Long classifier = unionClassifiers[i];
            Double features = classifier2features.get(classifier);
            if (features == null) {
                res[i] = 0.0;
            } else {
                res[i] = features;
            }
        }
        return res;
    }
}
