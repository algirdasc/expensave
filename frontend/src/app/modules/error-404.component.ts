import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: `<div class="d-flex align-items-center justify-content-center h-100 p-3">
        <nb-card class="mb-0">
            <nb-card-body class="text-center">
                <h2>404 Page Not Found</h2>
                <small class="sub-title">The page you were looking for doesn't exist</small>
                <button nbButton ghost fullWidth (click)="router.navigate(['/calendar'])" status="primary" class="mt-3">
                    Take me home
                </button>
            </nb-card-body>
        </nb-card>
    </div>`,
    standalone: false
})
export class Error404Component {
    public constructor(public router: Router) {}
}
