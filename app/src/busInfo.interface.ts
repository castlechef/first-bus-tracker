export interface BusInfo {
  data: {
    routeName: string,
    location: {
      latitude: number,
      longitude: number
    },
    nextBusStops: [
      {
        busStopId: number,
        busStopName: string,
        expectedArrival: string
      },
      {
        busStopId: number,
        busStopName: string,
        expectedArrival: string
      }
      ],
    capacity: number
  }
}
