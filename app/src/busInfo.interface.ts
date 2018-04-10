export interface BusInfo {
  busId: number,
  location: {
    latitude: number,
    longitude: number
  },
  routeName: string,
  capacity: string,
  departureTimes: [
    {
      busStopId: number,
      busStopName: string,
      departureTime: string
    },
    {
      busStopId: number,
      busStopName: string,
      departureTime: string
    }
    ],
  expectedArrivals: [
    {
      busStopId: number,
      busStopName: string,
      arrivalTime: string
    },
    {
      busStopId: number,
      busStopName: string,
      arrivalTime: string
    }
    ]
}
