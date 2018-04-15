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
      busStopsName: string,
      departureTime: string
    },
    {
      busStopId: number,
      busStopsName: string,
      departureTime: string
    }
    ],
  arrivalTimes: [
    {
      busStopId: number,
      busStopsName: string,
      arrivalTime: string
    },
    {
      busStopId: number,
      busStopsName: string,
      arrivalTime: string
    }
    ]
}
