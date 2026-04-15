import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AutService } from "../services/aut-service";

export const authGuard: CanActivateFn = () => {
    const auth = inject(AutService);
    const router = inject(Router);

    return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
}

export const guestGuard : CanActivateFn = () => {
    const auth = inject(AutService);
    const router = inject(Router);

    return auth.isAuthenticated() ? router.createUrlTree(['/home']) : true;
}