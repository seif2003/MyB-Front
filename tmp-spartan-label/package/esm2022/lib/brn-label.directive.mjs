import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, PLATFORM_ID, inject, input, signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as i0 from "@angular/core";
let nextId = 0;
export class BrnLabelDirective {
    constructor() {
        this._ngControl = inject(NgControl, { optional: true });
        this.id = input(`brn-label-${nextId++}`);
        this._isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
        this._element = inject(ElementRef).nativeElement;
        this._dataDisabled = signal('auto');
        this.dataDisabled = this._dataDisabled.asReadonly();
    }
    ngOnInit() {
        if (!this._isBrowser)
            return;
        this._changes = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName !== 'data-disabled')
                    return;
                // eslint-disable-next-line
                const state = mutation.target.attributes.getNamedItem(mutation.attributeName)?.value === 'true';
                this._dataDisabled.set(state ?? 'auto');
            });
        });
        this._changes?.observe(this._element, {
            attributes: true,
            childList: true,
            characterData: true,
        });
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: BrnLabelDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.5", type: BrnLabelDirective, isStandalone: true, selector: "[brnLabel]", inputs: { id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "id": "id()", "class.ng-invalid": "this._ngControl?.invalid || null", "class.ng-dirty": "this._ngControl?.dirty || null", "class.ng-valid": "this._ngControl?.valid || null", "class.ng-touched": "this._ngControl?.touched || null" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: BrnLabelDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[brnLabel]',
                    standalone: true,
                    host: {
                        '[id]': 'id()',
                        '[class.ng-invalid]': 'this._ngControl?.invalid || null',
                        '[class.ng-dirty]': 'this._ngControl?.dirty || null',
                        '[class.ng-valid]': 'this._ngControl?.valid || null',
                        '[class.ng-touched]': 'this._ngControl?.touched || null',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJuLWxhYmVsLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvdWkvbGFiZWwvYnJhaW4vc3JjL2xpYi9icm4tbGFiZWwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFlLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTNDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQWFmLE1BQU0sT0FBTyxpQkFBaUI7SUFYOUI7UUFZb0IsZUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUV0RCxPQUFFLEdBQUcsS0FBSyxDQUFTLGFBQWEsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLGVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNwRCxhQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUU1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBbUIsTUFBTSxDQUFDLENBQUM7UUFDbEQsaUJBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBa0IvRDtJQWhCQSxRQUFRO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxTQUEyQixFQUFFLEVBQUU7WUFDcEUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQXdCLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxRQUFRLENBQUMsYUFBYSxLQUFLLGVBQWU7b0JBQUUsT0FBTztnQkFDdkQsMkJBQTJCO2dCQUMzQixNQUFNLEtBQUssR0FBSSxRQUFRLENBQUMsTUFBYyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUssS0FBSyxNQUFNLENBQUM7Z0JBQ3pHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNyQyxVQUFVLEVBQUUsSUFBSTtZQUNoQixTQUFTLEVBQUUsSUFBSTtZQUNmLGFBQWEsRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQztJQUNKLENBQUM7aUlBMUJXLGlCQUFpQjtxSEFBakIsaUJBQWlCOzsyRkFBakIsaUJBQWlCO2tCQVg3QixTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSxZQUFZO29CQUN0QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNMLE1BQU0sRUFBRSxNQUFNO3dCQUNkLG9CQUFvQixFQUFFLGtDQUFrQzt3QkFDeEQsa0JBQWtCLEVBQUUsZ0NBQWdDO3dCQUNwRCxrQkFBa0IsRUFBRSxnQ0FBZ0M7d0JBQ3BELG9CQUFvQixFQUFFLGtDQUFrQztxQkFDeEQ7aUJBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIHR5cGUgT25Jbml0LCBQTEFURk9STV9JRCwgaW5qZWN0LCBpbnB1dCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbYnJuTGFiZWxdJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbaWRdJzogJ2lkKCknLFxuXHRcdCdbY2xhc3MubmctaW52YWxpZF0nOiAndGhpcy5fbmdDb250cm9sPy5pbnZhbGlkIHx8IG51bGwnLFxuXHRcdCdbY2xhc3MubmctZGlydHldJzogJ3RoaXMuX25nQ29udHJvbD8uZGlydHkgfHwgbnVsbCcsXG5cdFx0J1tjbGFzcy5uZy12YWxpZF0nOiAndGhpcy5fbmdDb250cm9sPy52YWxpZCB8fCBudWxsJyxcblx0XHQnW2NsYXNzLm5nLXRvdWNoZWRdJzogJ3RoaXMuX25nQ29udHJvbD8udG91Y2hlZCB8fCBudWxsJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgQnJuTGFiZWxEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXHRwcm90ZWN0ZWQgcmVhZG9ubHkgX25nQ29udHJvbCA9IGluamVjdChOZ0NvbnRyb2wsIHsgb3B0aW9uYWw6IHRydWUgfSk7XG5cblx0cHVibGljIHJlYWRvbmx5IGlkID0gaW5wdXQ8c3RyaW5nPihgYnJuLWxhYmVsLSR7bmV4dElkKyt9YCk7XG5cblx0cHJpdmF0ZSByZWFkb25seSBfaXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIoaW5qZWN0KFBMQVRGT1JNX0lEKSk7XG5cdHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnQgPSBpbmplY3QoRWxlbWVudFJlZikubmF0aXZlRWxlbWVudDtcblx0cHJpdmF0ZSBfY2hhbmdlcz86IE11dGF0aW9uT2JzZXJ2ZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgX2RhdGFEaXNhYmxlZCA9IHNpZ25hbDxib29sZWFuIHwgJ2F1dG8nPignYXV0bycpO1xuXHRwdWJsaWMgcmVhZG9ubHkgZGF0YURpc2FibGVkID0gdGhpcy5fZGF0YURpc2FibGVkLmFzUmVhZG9ubHkoKTtcblxuXHRuZ09uSW5pdCgpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMuX2lzQnJvd3NlcikgcmV0dXJuO1xuXHRcdHRoaXMuX2NoYW5nZXMgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG5cdFx0XHRtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKSA9PiB7XG5cdFx0XHRcdGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lICE9PSAnZGF0YS1kaXNhYmxlZCcpIHJldHVybjtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdFx0XHRcdGNvbnN0IHN0YXRlID0gKG11dGF0aW9uLnRhcmdldCBhcyBhbnkpLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpPy52YWx1ZSA9PT0gJ3RydWUnO1xuXHRcdFx0XHR0aGlzLl9kYXRhRGlzYWJsZWQuc2V0KHN0YXRlID8/ICdhdXRvJyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHR0aGlzLl9jaGFuZ2VzPy5vYnNlcnZlKHRoaXMuX2VsZW1lbnQsIHtcblx0XHRcdGF0dHJpYnV0ZXM6IHRydWUsXG5cdFx0XHRjaGlsZExpc3Q6IHRydWUsXG5cdFx0XHRjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuXHRcdH0pO1xuXHR9XG59XG4iXX0=