import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchPlans, subscribeToPlan, clearSubscribeSuccess } from "../features/plan/planSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Check, Loader2, Sparkles, TrendingUp, Zap, CheckCircle2, XCircle } from "lucide-react"

export default function Plan() {
  const dispatch = useAppDispatch()
  const { plans, loading, error, subscribeSuccess } = useAppSelector((state) => state.plan)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchPlans())
  }, [dispatch])

  useEffect(() => {
    if (subscribeSuccess) {
      setTimeout(() => {
        dispatch(clearSubscribeSuccess())
        setSelectedPlanId(null)
      }, 3000)
    }
  }, [subscribeSuccess, dispatch])

  const handleSubscribe = (planId: string) => {
    setSelectedPlanId(planId)
    dispatch(subscribeToPlan(planId))
  }

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes("premium") || name.includes("pro")) {
      return <Sparkles className="h-6 w-6 text-yellow-500" />
    }
    if (name.includes("basic") || name.includes("starter")) {
      return <Zap className="h-6 w-6 text-blue-500" />
    }
    return <TrendingUp className="h-6 w-6 text-green-500" />
  }

  const getPlanBadge = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes("premium") || name.includes("pro")) {
      return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">Popular</Badge>
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and take your content to the next level
          </p>
        </div>

        {/* Success/Error Messages */}
        {subscribeSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-600">
              Successfully subscribed to the plan!
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {loading && plans.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan._id}
                className="relative flex flex-col hover:shadow-lg transition-shadow"
              >
                {getPlanBadge(plan.name) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {getPlanBadge(plan.name)}
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.duration} days access
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.duration}d</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Upload up to <strong>{plan.features.uploadLimit}</strong> videos
                      </span>
                    </li>
                    {plan.features.analyticsAccess && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Advanced analytics dashboard</span>
                      </li>
                    )}
                    {plan.features.adFree && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Ad-free experience</span>
                      </li>
                    )}
                    {plan.features.aiTools && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">AI-powered tools & insights</span>
                      </li>
                    )}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={loading && selectedPlanId === plan._id}
                  >
                    {loading && selectedPlanId === plan._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && plans.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No plans available</h3>
              <p className="text-sm text-muted-foreground text-center">
                Check back later for subscription plans
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
