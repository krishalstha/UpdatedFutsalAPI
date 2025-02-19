import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-setting',
  imports: [NgClass],
  templateUrl: './setting.component.html',
  styleUrls:['./setting.css'],
})
export class SettingComponent {
  menuVisible = false; // This will track if the menu is visible

  toggleMenu() {
    this.menuVisible = !this.menuVisible; // Toggle the visibility
  }
}
