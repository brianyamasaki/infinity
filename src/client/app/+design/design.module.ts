import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DesignComponent } from './design.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [DesignComponent],
    exports: [DesignComponent],
    providers: []
})

export class HomeModule { }
