import { useDispatch, useSelector } from "react-redux";
import { selectCanCreateBranchTesting } from "./thunks.js";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useCanCreateBranchTesting = () =>
  useAppSelector(selectCanCreateBranchTesting);
