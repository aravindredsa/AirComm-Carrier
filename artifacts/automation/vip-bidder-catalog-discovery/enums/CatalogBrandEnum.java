package automation.enums;

public enum CatalogBrandEnum {
	APPLE("Apple"),
	SAMSUNG("Samsung"),
	GOOGLE("Google");

	private final String displayValue;

	CatalogBrandEnum(String displayValue) {
		this.displayValue = displayValue;
	}

	public String getDisplayValue() {
		return displayValue;
	}
}
