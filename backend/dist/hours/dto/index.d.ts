export declare class HourEntryDto {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
}
export declare class SetHoursDto {
    hours: HourEntryDto[];
}
export declare class UpdateHourDto {
    dayOfWeek?: number;
    openTime?: string;
    closeTime?: string;
}
