package automation.tests.support;

public final class TestLogger {

	private TestLogger() {
	}

	public static void data(String key, Object value) {
		System.out.println("[DATA] " + key + "=" + value);
	}

	public static void pass(String message) {
		System.out.println("[PASS] " + message);
	}

	public static void fail(String message, Throwable throwable) {
		System.err.println("[FAIL] " + message);
		if (throwable != null) {
			throwable.printStackTrace(System.err);
		}
	}
}
