import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (action.payload?.status == 401) {
        toast.error('Unauthorized');
        signOut({ callbackUrl: '/login', redirect: true });
      }
    }

    return next(action);
  };
