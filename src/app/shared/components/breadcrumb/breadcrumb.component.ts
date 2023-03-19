import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BreadCrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadCrumb[];

  // Build your breadcrumb starting with the root route of your current activated route

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.renderBreadCrumb();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.renderBreadCrumb();
    });
  }

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<BreadCrumb> = []
  ): Array<BreadCrumb> {
    // If no routeConfig is available we are on the root path
    const label = route.routeConfig ? route.routeConfig.data?.['breadcrumb'] : 'Home';
    const path = route.routeConfig ? route.routeConfig.path : '';

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time

    let nextUrl: string;
    let newBreadcrumbs: Array<BreadCrumb>;

    if (label !== null) {
      nextUrl = `${url}${path}/`;
      const breadcrumb = {
        label: label,
        url: nextUrl
      };
      newBreadcrumbs = [...breadcrumbs, breadcrumb];
    } else {
      nextUrl = url;
      newBreadcrumbs = breadcrumbs;
    }
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcrumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  renderBreadCrumb() {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    this.breadcrumbs.shift();
  }
}
