import { Directive, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva } from 'class-variance-authority';
import { injectBrnButtonConfig } from './hlm-button.token';
import * as i0 from "@angular/core";
export const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'underline-offset-4 hover:underline text-primary',
        },
        size: {
            default: 'h-10 py-2 px-4',
            sm: 'h-9 px-3 rounded-md',
            lg: 'h-11 px-8 rounded-md',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
export class HlmButtonDirective {
    constructor() {
        this._config = injectBrnButtonConfig();
        this._additionalClasses = signal('');
        this.userClass = input('', { alias: 'class' });
        this._computedClass = computed(() => hlm(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass(), this._additionalClasses()));
        this.variant = input(this._config.variant);
        this.size = input(this._config.size);
    }
    setClass(classes) {
        this._additionalClasses.set(classes);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.5", type: HlmButtonDirective, isStandalone: true, selector: "[hlmBtn]", inputs: { userClass: { classPropertyName: "userClass", publicName: "class", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class": "_computedClass()" } }, exportAs: ["hlmBtn"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[hlmBtn]',
                    standalone: true,
                    exportAs: 'hlmBtn',
                    host: {
                        '[class]': '_computedClass()',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGxtLWJ1dHRvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9saWJzL3VpL2J1dHRvbi9oZWxtL3NyYy9saWIvaGxtLWJ1dHRvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUMsT0FBTyxFQUFxQixHQUFHLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFM0QsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FDaEMsc1FBQXNRLEVBQ3RRO0lBQ0MsUUFBUSxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1IsT0FBTyxFQUFFLHdEQUF3RDtZQUNqRSxXQUFXLEVBQUUsb0VBQW9FO1lBQ2pGLE9BQU8sRUFBRSxrRUFBa0U7WUFDM0UsU0FBUyxFQUFFLDhEQUE4RDtZQUN6RSxLQUFLLEVBQUUsOENBQThDO1lBQ3JELElBQUksRUFBRSxpREFBaUQ7U0FDdkQ7UUFDRCxJQUFJLEVBQUU7WUFDTCxPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLEVBQUUsRUFBRSxxQkFBcUI7WUFDekIsRUFBRSxFQUFFLHNCQUFzQjtZQUMxQixJQUFJLEVBQUUsV0FBVztTQUNqQjtLQUNEO0lBQ0QsZUFBZSxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLElBQUksRUFBRSxTQUFTO0tBQ2Y7Q0FDRCxDQUNELENBQUM7QUFXRixNQUFNLE9BQU8sa0JBQWtCO0lBUi9CO1FBU2tCLFlBQU8sR0FBRyxxQkFBcUIsRUFBRSxDQUFDO1FBRWxDLHVCQUFrQixHQUFHLE1BQU0sQ0FBYSxFQUFFLENBQUMsQ0FBQztRQUU3QyxjQUFTLEdBQUcsS0FBSyxDQUFhLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELG1CQUFjLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUNqRCxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FDaEgsQ0FBQztRQUVjLFlBQU8sR0FBRyxLQUFLLENBQTRCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakUsU0FBSSxHQUFHLEtBQUssQ0FBeUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUt4RTtJQUhBLFFBQVEsQ0FBQyxPQUFlO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztpSUFqQlcsa0JBQWtCO3FIQUFsQixrQkFBa0I7OzJGQUFsQixrQkFBa0I7a0JBUjlCLFNBQVM7bUJBQUM7b0JBQ1YsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsSUFBSSxFQUFFO3dCQUNMLFNBQVMsRUFBRSxrQkFBa0I7cUJBQzdCO2lCQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBjb21wdXRlZCwgaW5wdXQsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaGxtIH0gZnJvbSAnQHNwYXJ0YW4tbmcvdWktY29yZSc7XG5pbXBvcnQgeyB0eXBlIFZhcmlhbnRQcm9wcywgY3ZhIH0gZnJvbSAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5JztcbmltcG9ydCB0eXBlIHsgQ2xhc3NWYWx1ZSB9IGZyb20gJ2Nsc3gnO1xuaW1wb3J0IHsgaW5qZWN0QnJuQnV0dG9uQ29uZmlnIH0gZnJvbSAnLi9obG0tYnV0dG9uLnRva2VuJztcblxuZXhwb3J0IGNvbnN0IGJ1dHRvblZhcmlhbnRzID0gY3ZhKFxuXHQnaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbWQgdGV4dC1zbSBmb250LW1lZGl1bSB0cmFuc2l0aW9uLWNvbG9ycyBmb2N1cy12aXNpYmxlOm91dGxpbmUtbm9uZSBmb2N1cy12aXNpYmxlOnJpbmctMiBmb2N1cy12aXNpYmxlOnJpbmctcmluZyBmb2N1cy12aXNpYmxlOnJpbmctb2Zmc2V0LTIgZGlzYWJsZWQ6b3BhY2l0eS01MCBkaXNhYmxlZDpwb2ludGVyLWV2ZW50cy1ub25lIHJpbmctb2Zmc2V0LWJhY2tncm91bmQnLFxuXHR7XG5cdFx0dmFyaWFudHM6IHtcblx0XHRcdHZhcmlhbnQ6IHtcblx0XHRcdFx0ZGVmYXVsdDogJ2JnLXByaW1hcnkgdGV4dC1wcmltYXJ5LWZvcmVncm91bmQgaG92ZXI6YmctcHJpbWFyeS85MCcsXG5cdFx0XHRcdGRlc3RydWN0aXZlOiAnYmctZGVzdHJ1Y3RpdmUgdGV4dC1kZXN0cnVjdGl2ZS1mb3JlZ3JvdW5kIGhvdmVyOmJnLWRlc3RydWN0aXZlLzkwJyxcblx0XHRcdFx0b3V0bGluZTogJ2JvcmRlciBib3JkZXItaW5wdXQgaG92ZXI6YmctYWNjZW50IGhvdmVyOnRleHQtYWNjZW50LWZvcmVncm91bmQnLFxuXHRcdFx0XHRzZWNvbmRhcnk6ICdiZy1zZWNvbmRhcnkgdGV4dC1zZWNvbmRhcnktZm9yZWdyb3VuZCBob3ZlcjpiZy1zZWNvbmRhcnkvODAnLFxuXHRcdFx0XHRnaG9zdDogJ2hvdmVyOmJnLWFjY2VudCBob3Zlcjp0ZXh0LWFjY2VudC1mb3JlZ3JvdW5kJyxcblx0XHRcdFx0bGluazogJ3VuZGVybGluZS1vZmZzZXQtNCBob3Zlcjp1bmRlcmxpbmUgdGV4dC1wcmltYXJ5Jyxcblx0XHRcdH0sXG5cdFx0XHRzaXplOiB7XG5cdFx0XHRcdGRlZmF1bHQ6ICdoLTEwIHB5LTIgcHgtNCcsXG5cdFx0XHRcdHNtOiAnaC05IHB4LTMgcm91bmRlZC1tZCcsXG5cdFx0XHRcdGxnOiAnaC0xMSBweC04IHJvdW5kZWQtbWQnLFxuXHRcdFx0XHRpY29uOiAnaC0xMCB3LTEwJyxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRkZWZhdWx0VmFyaWFudHM6IHtcblx0XHRcdHZhcmlhbnQ6ICdkZWZhdWx0Jyxcblx0XHRcdHNpemU6ICdkZWZhdWx0Jyxcblx0XHR9LFxuXHR9LFxuKTtcbmV4cG9ydCB0eXBlIEJ1dHRvblZhcmlhbnRzID0gVmFyaWFudFByb3BzPHR5cGVvZiBidXR0b25WYXJpYW50cz47XG5cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tobG1CdG5dJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0ZXhwb3J0QXM6ICdobG1CdG4nLFxuXHRob3N0OiB7XG5cdFx0J1tjbGFzc10nOiAnX2NvbXB1dGVkQ2xhc3MoKScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIEhsbUJ1dHRvbkRpcmVjdGl2ZSB7XG5cdHByaXZhdGUgcmVhZG9ubHkgX2NvbmZpZyA9IGluamVjdEJybkJ1dHRvbkNvbmZpZygpO1xuXG5cdHByaXZhdGUgcmVhZG9ubHkgX2FkZGl0aW9uYWxDbGFzc2VzID0gc2lnbmFsPENsYXNzVmFsdWU+KCcnKTtcblxuXHRwdWJsaWMgcmVhZG9ubHkgdXNlckNsYXNzID0gaW5wdXQ8Q2xhc3NWYWx1ZT4oJycsIHsgYWxpYXM6ICdjbGFzcycgfSk7XG5cblx0cHJvdGVjdGVkIHJlYWRvbmx5IF9jb21wdXRlZENsYXNzID0gY29tcHV0ZWQoKCkgPT5cblx0XHRobG0oYnV0dG9uVmFyaWFudHMoeyB2YXJpYW50OiB0aGlzLnZhcmlhbnQoKSwgc2l6ZTogdGhpcy5zaXplKCkgfSksIHRoaXMudXNlckNsYXNzKCksIHRoaXMuX2FkZGl0aW9uYWxDbGFzc2VzKCkpLFxuXHQpO1xuXG5cdHB1YmxpYyByZWFkb25seSB2YXJpYW50ID0gaW5wdXQ8QnV0dG9uVmFyaWFudHNbJ3ZhcmlhbnQnXT4odGhpcy5fY29uZmlnLnZhcmlhbnQpO1xuXG5cdHB1YmxpYyByZWFkb25seSBzaXplID0gaW5wdXQ8QnV0dG9uVmFyaWFudHNbJ3NpemUnXT4odGhpcy5fY29uZmlnLnNpemUpO1xuXG5cdHNldENsYXNzKGNsYXNzZXM6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMuX2FkZGl0aW9uYWxDbGFzc2VzLnNldChjbGFzc2VzKTtcblx0fVxufVxuIl19