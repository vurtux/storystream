'use client';
import { useContext } from 'react';
import DashboardContext, { DashboardContextType } from '../context/DashboardProvider'

const useDashboard = (): DashboardContextType => {
    return useContext(DashboardContext)
}

export default useDashboard