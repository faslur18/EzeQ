"use client"

import React, { useEffect, useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AdminSidebar from '@/components/layout/admin-sidebar'
import DashboardHeader from '@/components/layout/dashboard-header'
import Icon from '@/components/ui/icon'
import { Card, CardContent } from '@/components/ui/card'
import FormInput from '@/components/ui/form-input'
import { useGetMySalonQuery } from '@/store/services/salonsApi'
import { useGetHoursQuery, useSetHoursMutation } from '@/store/services/hoursApi'

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

type TimeSlot = {
  openTime: string;
  closeTime: string;
}

type DailySchedule = {
  dayOfWeek: number;
  slots: TimeSlot[];
  isClosed: boolean;
}

function SchedulesContent() {
  const { data: adminSalon, isLoading: salonLoading } = useGetMySalonQuery();
  const { data: existingHours, isLoading: hoursLoading } = useGetHoursQuery(adminSalon?.id || "", {
    skip: !adminSalon?.id
  });
  const [setHours, { isLoading: isSaving }] = useSetHoursMutation();

  // Local state for the form
  const [schedule, setSchedule] = useState<DailySchedule[]>(
    DAYS.map((_, index) => ({
      dayOfWeek: index,
      slots: [{ openTime: "09:00", closeTime: "18:00" }],
      isClosed: false
    }))
  );

  useEffect(() => {
    if (existingHours && existingHours.length > 0) {
      const newSchedule = DAYS.map((_, index) => ({
        dayOfWeek: index,
        slots: [] as TimeSlot[],
        isClosed: true
      }));

      existingHours.forEach(h => {
        newSchedule[h.dayOfWeek].isClosed = false;
        newSchedule[h.dayOfWeek].slots.push({
          openTime: h.openTime || "09:00",
          closeTime: h.closeTime || "18:00"
        });
      });

      // Regularize: Sort slots by time
      newSchedule.forEach(day => {
        day.slots.sort((a, b) => a.openTime.localeCompare(b.openTime));
        if (day.slots.length === 0) {
          day.isClosed = true;
          day.slots = [{ openTime: "09:00", closeTime: "18:00" }];
        }
      });

      setSchedule(newSchedule);
    }
  }, [existingHours]);

  const handleSlotChange = (dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) => {
    const newSchedule = [...schedule];
    const newSlots = [...newSchedule[dayIndex].slots];
    newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
    newSchedule[dayIndex] = { ...newSchedule[dayIndex], slots: newSlots };
    setSchedule(newSchedule);
  };

  const addSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const lastSlot = newSchedule[dayIndex].slots[newSchedule[dayIndex].slots.length - 1];

    // Default new slot to 1 hour after previous slot ends
    const newOpen = lastSlot ? lastSlot.closeTime : "09:00";
    const newClose = "20:00";

    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      slots: [...newSchedule[dayIndex].slots, { openTime: newOpen, closeTime: newClose }]
    };
    setSchedule(newSchedule);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    const newSlots = newSchedule[dayIndex].slots.filter((_, i) => i !== slotIndex);

    if (newSlots.length === 0) {
      newSchedule[dayIndex] = { ...newSchedule[dayIndex], slots: [{ openTime: "09:00", closeTime: "18:00" }], isClosed: true };
    } else {
      newSchedule[dayIndex] = { ...newSchedule[dayIndex], slots: newSlots };
    }
    setSchedule(newSchedule);
  };

  const handleToggleClosed = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex] = { ...newSchedule[dayIndex], isClosed: !newSchedule[dayIndex].isClosed };
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    if (!adminSalon?.id) return;

    try {
      const allHours = schedule
        .filter(day => !day.isClosed)
        .flatMap(day => day.slots.map(slot => ({
          dayOfWeek: day.dayOfWeek,
          openTime: slot.openTime,
          closeTime: slot.closeTime
        })));

      await setHours({
        salonId: adminSalon.id,
        body: { hours: allHours }
      }).unwrap();

      alert("Weekly schedule updated successfully!");
    } catch (err) {
      console.error("Failed to save hours:", err);
      alert("Failed to save schedules. Please try again.");
    }
  };

  // Helper to calculate break between slots
  const getBreakTime = (day: DailySchedule, slotIndex: number) => {
    if (slotIndex === 0) return null;
    const prevSlot = day.slots[slotIndex - 1];
    const currentSlot = day.slots[slotIndex];
    return `${prevSlot.closeTime} - ${currentSlot.openTime}`;
  };

  if (salonLoading || hoursLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-pulse text-lg font-bold text-slate-900">Loading schedules...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <AdminSidebar salonName={adminSalon?.name || "Salon"} activePath="/admin/schedules" />

      <main className="flex flex-1 pt-4 pb-0 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
        <DashboardHeader
          title="Work Schedule & Breaks"
          subtitle="Define your daily work periods. Gaps between periods will be treated as breaks."
          mobileName={adminSalon?.name}
        />

        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <Card className="p-0 border-primary/20 bg-primary/5 shadow-none overflow-hidden">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-sm shadow-sm border-2 border-primary/10 text-primary">
                  <Icon name="more_time" size="lg" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Multi-Shift Support</h4>
                  <p className="text-sm text-slate-600 font-medium">
                    Add multiple time slots per day to handle morning/evening shifts and break times.
                  </p>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : (
                  <>
                    <Icon name="save" size="sm" />
                    Save Weekly Schedule
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6 pb-20">
            {schedule.map((day, dayIndex) => (
              <Card key={day.dayOfWeek} className={`p-0 ${day.isClosed ? 'bg-slate-50 border-dashed border-slate-300' : 'bg-white'} transition-all`}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row border-b-2 border-input last:border-0 border-dashed md:border-solid">

                    {/* Day Name Column */}
                    <div className={`p-6 md:w-[200px] border-b-2 md:border-b-0 md:border-r-2 border-input flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 ${day.isClosed ? 'bg-slate-100 opacity-60' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 flex items-center justify-center rounded-sm font-bold border-2 ${day.isClosed ? 'bg-slate-200 border-slate-300 text-slate-500' : 'bg-black border-black text-white'}`}>
                          {DAYS[day.dayOfWeek].substring(0, 2)}
                        </div>
                        <span className="text-lg font-bold text-slate-900">{DAYS[day.dayOfWeek]}</span>
                      </div>
                      <button
                        onClick={() => handleToggleClosed(dayIndex)}
                        className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${day.isClosed
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-white text-rose-500 border-rose-200 hover:border-rose-400'
                          } transition-colors`}
                      >
                        {day.isClosed ? "Open For Work" : "Mark Closed"}
                      </button>
                    </div>

                    {/* Time Slots Column */}
                    <div className="flex-1 p-6 space-y-4">
                      {day.isClosed ? (
                        <div className="h-full flex items-center justify-center text-slate-400 font-bold italic py-4 gap-2">
                          <Icon name="hotel" size="sm" />
                          Shop is closed on this day
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {day.slots.map((slot, slotIndex) => {
                            const breakInfo = getBreakTime(day, slotIndex);
                            return (
                              <div key={slotIndex} className="space-y-4">
                                {breakInfo && (
                                  <div className="flex items-center gap-4 py-1">
                                    <div className="flex-1 h-px bg-slate-200 border-dashed border-t"></div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-wider">
                                      <Icon name="coffee" size="sm" className="scale-75" />
                                      Break: {breakInfo}
                                    </div>
                                    <div className="flex-1 h-px bg-slate-200 border-dashed border-t"></div>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row items-center gap-4 group">
                                  <div className="bg-slate-100 text-slate-500 font-black text-[10px] uppercase h-8 px-3 rounded-sm flex items-center justify-center border border-slate-200">
                                    {slotIndex === 0 ? "Morning" : slotIndex === 1 ? "Afternoon" : slotIndex === 2 ? "Evening" : `Slot ${slotIndex + 1}`}
                                  </div>

                                  <div className="flex-1 flex items-center gap-4 w-full">
                                    <div className="flex-1">
                                      <FormInput
                                        type="time"
                                        value={slot.openTime}
                                        onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'openTime', e.target.value)}
                                        className="h-11 px-3 py-1 font-bold border-slate-200 hover:border-primary transition-colors focus:border-primary"
                                      />
                                    </div>
                                    <Icon name="arrow_forward" size="sm" className="text-slate-300" />
                                    <div className="flex-1">
                                      <FormInput
                                        type="time"
                                        value={slot.closeTime}
                                        onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'closeTime', e.target.value)}
                                        className="h-11 px-3 py-1 font-bold border-slate-200 hover:border-primary transition-colors focus:border-primary"
                                      />
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => removeSlot(dayIndex, slotIndex)}
                                    className="h-11 w-11 flex items-center justify-center rounded-sm border-2 border-transparent text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove time slot"
                                  >
                                    <Icon name="delete" size="sm" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          <button
                            onClick={() => addSlot(dayIndex)}
                            className="w-full py-3 rounded-sm border-2 border-dashed border-input text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 text-sm font-bold flex items-center justify-center gap-2 transition-all mt-4"
                          >
                            <Icon name="add" size="sm" />
                            Add Work Period
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sticky Action Bar at Bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-input z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] mt-auto">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 p-4 md:p-8">
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">Review Changes</p>
              <p className="text-xs text-slate-500 font-medium leading-tight">Click save to persist your weekly availability</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-slate-900 border-2 border-slate-900 hover:bg-black text-white font-black px-12 py-3 rounded-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSaving ? "Updating..." : (
                <>
                  <Icon name="done_all" size="md" />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SchedulesPage() {
  return (
    <AuthGuard allowedRoles={["SALON_ADMIN"]}>
      <SchedulesContent />
    </AuthGuard>
  )
}
