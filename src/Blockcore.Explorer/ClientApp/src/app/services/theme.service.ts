import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;

    get darkMode(): boolean {
        if (localStorage.getItem('theme')) {
            if (localStorage.getItem('theme') === 'dark') {
                return true;
            }
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }

        return false;
    }

    set darkMode(value: boolean) {
        if (value) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'white');
        }

        this.updateMode();
    }

    public init(renderer: Renderer2) {
        this.renderer = renderer;
        this.updateMode();
    }

    private updateMode() {
        if (this.darkMode) {
            this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
        } else {
            this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
        }
    }
}