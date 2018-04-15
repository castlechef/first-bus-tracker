export interface Stop {
  busStopId: number,
  busStopName: string,
  location: {
    latitude: number,
    longitude: number
  },
  busRoutePosition: [
    {
      name: string,
      position: number
    },
    {
      name: string,
      position: number
    }
    ]
}
