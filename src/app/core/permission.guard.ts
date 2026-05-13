import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { UserProfile } from './models';

const hasAccess = (user: UserProfile, requiredPermissions: string[], requiredRoles: string[]) => {
  if (requiredPermissions.length) {
    const hasAll = requiredPermissions.every((perm) => user.permissions.includes(perm));
    if (!hasAll) {
      return false;
    }
  }

  if (requiredRoles.length) {
    return requiredRoles.some((role) => user.roles.includes(role as never));
  }

  return true;
};

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  const requiredPermissions = (route.data?.['permissions'] as string[]) || [];
  const requiredRoles = (route.data?.['roles'] as string[]) || [];

  if (user) {
    return hasAccess(user, requiredPermissions, requiredRoles) ? true : router.createUrlTree(['/']);
  }

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  return auth.loadProfile().pipe(
    map((loaded) => {
      const loadedUser = auth.user();
      if (!loaded || !loadedUser) {
        return router.createUrlTree(['/login']);
      }

      return hasAccess(loadedUser, requiredPermissions, requiredRoles) ? true : router.createUrlTree(['/']);
    })
  );
};
