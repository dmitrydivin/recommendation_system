package alg.classifiers;

import org.junit.jupiter.api.Test;

import java.util.List;

/**
 * @author Dmitry Divin
 */
public class ClassifierSimilarityFunctionsTests {

    @Test
    public void testCompare() {
        ClassifierSimilarityFunctions functions = new ClassifierSimilarityFunctions();
        functions.similar(List.of(1l, 2l), List.of(1.0, 2.1), List.of(1l), List.of(1.0));
    }
}
