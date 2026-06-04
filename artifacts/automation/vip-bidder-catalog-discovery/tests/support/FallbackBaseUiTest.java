package automation.tests.support;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class FallbackBaseUiTest {

	protected WebDriver driver;

	@BeforeMethod
	public void setUpDriver() {
		// NOT FOUND - using repository standard fallback
		// Replace with repository driver bootstrap pattern.
		driver = null;
	}

	@AfterMethod
	public void tearDownDriver() {
		if (driver != null) {
			driver.quit();
		}
	}
}
