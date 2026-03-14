'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

export function useUser() {
	return useContext(AuthContext);
}
