import {  useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../app/store"
import type { TypedUseSelectorHook } from "react-redux"
// typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

// typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector