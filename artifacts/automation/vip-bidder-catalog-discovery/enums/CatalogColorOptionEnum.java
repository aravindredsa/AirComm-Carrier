package automation.enums;

public enum CatalogColorOptionEnum {
	GRAPHITE("Graphite"),
	TITANIUM("Titanium"),
	OCEAN("Ocean"),
	LILAC("Lilac"),
	HAZEL("Hazel");

	private final String displayValue;

	CatalogColorOptionEnum(String displayValue) {
		this.displayValue = displayValue;
	}

	public String getDisplayValue() {
		return displayValue;
	}
}
