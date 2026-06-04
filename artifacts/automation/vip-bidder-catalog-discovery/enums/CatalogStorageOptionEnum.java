package automation.enums;

public enum CatalogStorageOptionEnum {
	SIZE_128_GB("128 GB"),
	SIZE_256_GB("256 GB"),
	SIZE_512_GB("512 GB"),
	SIZE_1_TB("1 TB");

	private final String displayValue;

	CatalogStorageOptionEnum(String displayValue) {
		this.displayValue = displayValue;
	}

	public String getDisplayValue() {
		return displayValue;
	}
}
