import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

export interface Page {
  label: string | number;
  value: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  pages: Page[] = [];
  paginationRange: number;
  maxPagesCount = 7;
  @Input() currentPage: number;
  @Input() totalCount: number;
  @Input() itemsPerPage: number;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() toPrevPage = new EventEmitter();
  @Output() toNextPage = new EventEmitter();

  ngOnChanges() {
    const limit = Math.ceil(this.totalCount / this.itemsPerPage);
    this.paginationRange = limit > this.maxPagesCount ? this.maxPagesCount : limit;
    this.pages = this.createPageArray(
      this.currentPage,
      this.itemsPerPage,
      this.totalCount,
      this.paginationRange
    );
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    let lastPage = Math.ceil(this.totalCount / this.itemsPerPage);
    return this.currentPage === lastPage;
  }

  onPageChanged(event: Event) {
    event.preventDefault();
    const value = +(event.target as HTMLElement).innerText;
    if (!Number.isNaN(value)) {
      this.pageChanged.emit(value);
    }
  }

  onPrevPage(event: Event) {
    event.preventDefault();
    this.toPrevPage.emit(this.currentPage - 1);
  }
  onNextPage(event: Event) {
    event.preventDefault();
    this.toNextPage.emit(this.currentPage + 1);
  }

  createPageArray(
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
    paginationRange: number
  ): Page[] {
    let pages: Page[] = [];

    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
    const halfWay = Math.ceil(paginationRange / 2);
    const isStart = currentPage <= halfWay;
    const isEnd = totalPages - halfWay < currentPage;
    const isMiddle = !isStart && !isEnd;

    let ellipsesNeeded = paginationRange < totalPages;

    for (let i = 1; i <= totalPages && i <= paginationRange; i++) {
      let label;
      let pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
      let openingEllipsesNeeded = i === 2 && (isMiddle || isEnd);
      let closingEllipsesNeeded = i === paginationRange - 1 && (isMiddle || isStart);
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        label = '...';
      } else {
        label = pageNumber;
      }
      pages.push({
        label: label,
        value: pageNumber
      });
    }
    return pages;
  }

  calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
    let halfWay = Math.ceil(paginationRange / 2);

    switch (true) {
      case i === paginationRange:
        return totalPages;
      case i === 1:
        return i;
      case totalPages - halfWay < currentPage:
        return totalPages - paginationRange + i;
      case halfWay < currentPage:
        return currentPage - halfWay + i;
      default:
        return i;
    }
  }
}
