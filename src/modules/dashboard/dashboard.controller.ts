export const getAnalytics = asyncHandler(
 async (req: Request, res: Response) => {

  const stats =
    await dashboardService.getAnalyticsService(
      req.user!._id.toString()
    )

  res.json(
    new ApiResponse(true, "Analytics", stats)
  )
})
export const getVideoStats = asyncHandler(
 async (req: Request, res: Response) => {

  const stats =
    await dashboardService.getVideoStatsService(
      req.user!._id
    )

  res.json(
    new ApiResponse(true, "Video stats fetched", stats)
  )
})