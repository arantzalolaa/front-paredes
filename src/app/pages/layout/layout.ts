import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidebarMenu } from '../../shared/sidebar-menu/sidebar-menu';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MatListModule, MatIconModule, SidebarMenu, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
}
