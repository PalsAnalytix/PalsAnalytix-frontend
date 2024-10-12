import { useDispatch, useSelector } from "react-redux";

// Custom hooks for using dispatch and selector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
