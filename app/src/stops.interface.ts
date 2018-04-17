export interface Stop {
  busStopId: number,
  busStopName: string,
  location: {
    latitude: number,
    longitude: number
  },
  routes: {
    name: string,
    position: number
  }[];
}
