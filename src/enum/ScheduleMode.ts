/**
 * Enum que define los modos de retiro de dinero del Portal de Cartolas.
 *
 * Este enum se utiliza en la creación de usuarios de tipo recaudador,
 * y sirve para configurar los días de retiro en el Portal de Cartolas.
 */
export enum ScheduleMode {
  /** Programación basada en días de la semana */
  DAYS_OF_WEEK = "DAYS_OF_WEEK",

  /** Programación basada en días específicos del mes */
  DAYS_OF_MONTH = "DAYS_OF_MONTH",
}
