export interface StopInfo {
  busStopId: number,
  busStopName: string,
  location: {
    latitude: number,
    longitude: number
  },
  arrivals: [
    {
      busId: number,
      routeName: string,
      arrivalTime: string
    },
    {
      busId: number,
      routeName: string,
      arrivalTime: string
    }
    ]
}
