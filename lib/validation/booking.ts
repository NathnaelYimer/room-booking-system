/**
 * Check if two time ranges overlap
 */
export function doTimesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && start2 < end1
}

/**
 * Validate booking times
 */
export interface BookingValidationError {
  field: string
  message: string
}

export function validateBookingTimes(startTime: string, endTime: string): BookingValidationError[] {
  const errors: BookingValidationError[] = []
  const start = new Date(startTime)
  const end = new Date(endTime)
  const now = new Date()

  if (!startTime) {
    errors.push({ field: "startTime", message: "Start time is required" })
  }

  if (!endTime) {
    errors.push({ field: "endTime", message: "End time is required" })
  }

  if (startTime && endTime && start >= end) {
    errors.push({
      field: "endTime",
      message: "End time must be after start time",
    })
  }

  if (startTime && start < now) {
    errors.push({
      field: "startTime",
      message: "Cannot book times in the past",
    })
  }

  // Maximum booking duration (24 hours)
  if (startTime && endTime) {
    const durationMs = end.getTime() - start.getTime()
    const maxDurationMs = 24 * 60 * 60 * 1000
    if (durationMs > maxDurationMs) {
      errors.push({
        field: "duration",
        message: "Booking cannot exceed 24 hours",
      })
    }
  }

  // Minimum booking duration (15 minutes)
  if (startTime && endTime) {
    const durationMs = end.getTime() - start.getTime()
    const minDurationMs = 15 * 60 * 1000
    if (durationMs < minDurationMs) {
      errors.push({
        field: "duration",
        message: "Booking must be at least 15 minutes",
      })
    }
  }

  return errors
}

/**
 * Calculate total duration in hours
 */
export function calculateDurationHours(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime()
  return durationMs / (1000 * 60 * 60)
}

/**
 * Calculate total cost
 */
export function calculateTotalCost(pricePerHour: number, durationHours: number): number {
  return pricePerHour * durationHours
}
