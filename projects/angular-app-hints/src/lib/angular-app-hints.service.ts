import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ElementStyle {
  readonly padding?: number;
  readonly borderRadius?: number;
}

export interface PathElement {
  readonly selector: string;
  readonly message: string;
  readonly disableClose?: boolean;
  readonly style?: ElementStyle;
}

export interface AngularAppHintsConfig {
  readonly nextText: string;
  readonly prevText: string;
  readonly closeText: string;
  readonly closeOnEscape: boolean;
  readonly enableAnimations: boolean;
  readonly scrollIntoViewOptions: ScrollIntoViewOptions;
  readonly defaultStyle?: ElementStyle;
  readonly appendToSelector?: string;
}

export type Path = PathElement[];

@Injectable({
  providedIn: 'root'
})
export class AngularAppHintsService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    // #region pivot
    this.pivot = this.document.createElement('div');
    this.pivot.classList.add('angular-app-hints__pivot');
    this.pivot.classList.add('angular-app-hints__pivot-animations');
    // #endregion

    // #region focus
    this.focus = this.document.createElement('div');
    this.focus.classList.add('angular-app-hints__shadow');
    this.pivot.appendChild(this.focus);

    this.focusInner = this.document.createElement('div');
    this.focusInner.classList.add('angular-app-hints__shadow-inner');
    this.focus.appendChild(this.focusInner);
    // #endregion

    // #region blockOverlay
    this.blockOverlay = this.document.createElement('div');
    this.blockOverlay.classList.add('angular-app-hints__overlay');
    // #endregion

    // #region menu
    this.menu = this.document.createElement('div');
    this.menu.classList.add('angular-app-hints__menu');
    this.pivot.appendChild(this.menu);

    const menuInner = this.document.createElement('div');
    menuInner.classList.add('angular-app-hints__menu-inner');
    this.menu.appendChild(menuInner);

    this.message = this.document.createElement('div');
    this.message.classList.add('angular-app-hints__message');
    menuInner.appendChild(this.message);
    
    const footer = this.document.createElement('div');
    footer.classList.add('angular-app-hints__footer');
    menuInner.appendChild(footer);

    this.prevButton = this.document.createElement('button');
    this.prevButton.classList.add('angular-app-hints__button');
    this.prevButton.classList.add('angular-app-hints__prev-button');
    this.prevButton.textContent = this.config.prevText;
    this.prevButton.onclick = () => this.previous();
    footer.appendChild(this.prevButton);

    this.nextButton = this.document.createElement('button');
    this.nextButton.classList.add('angular-app-hints__button');
    this.nextButton.classList.add('angular-app-hints__next-button');
    this.nextButton.textContent = this.config.nextText;
    this.nextButton.onclick = () => this.next();
    footer.appendChild(this.nextButton);

    this.closeButton = this.document.createElement('button');
    this.closeButton.classList.add('angular-app-hints__button');
    this.closeButton.classList.add('angular-app-hints__close-button');
    this.closeButton.textContent = this.config.closeText;
    this.closeButton.onclick = () => this.close();
    footer.appendChild(this.closeButton);
    // #endregion

    // #region events
    this.document.addEventListener('keydown', e => {
      if (
        this.config.closeOnEscape
        && !!this.currentElement
        && !this.currentElement.disableClose
        && (e.key === 'Escape' || e.key === 'Esc')
      ) {
        this.close();
      }
    });
    // #endregion
  }

  private path: Path = [];
  private filteredPath: Path = [];
  private pivot: HTMLElement;
  private focus: HTMLDivElement;
  private focusInner: HTMLDivElement;
  private blockOverlay: HTMLDivElement;
  private menu: HTMLDivElement;
  private message: HTMLDivElement;
  private prevButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private closeButton: HTMLButtonElement;
  private config: AngularAppHintsConfig = {
    nextText: 'Next',
    prevText: 'Previous',
    closeText: 'Close',
    closeOnEscape: true,
    enableAnimations: true,
    scrollIntoViewOptions: {
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    },
  };
  private currentElement: PathElement | null = null;

  public setPath(path: Path): void {
    if (this.currentElement) {
      throw new Error('TODO');
    }
    this.path = path || [];
  }

  public setConfig(config: Partial<AngularAppHintsConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
    this.prevButton.textContent = this.config.prevText;
    this.nextButton.textContent = this.config.nextText;
    this.closeButton.textContent = this.config.closeText;
    this.pivot.classList.toggle(
      'angular-app-hints__pivot-animations',
      this.config.enableAnimations
    );
  }

  public go(): void {
    this.filteredPath = this.path.filter(
      i => !!this.document.querySelector(i.selector)
    );
    if (!this.currentElement) {
      this.currentElement = this.filteredPath[0];
      this.setFocused(this.currentElement);
      this.updateMenuContent();
      const appendToSelector = this.config.appendToSelector ?? 'body';
      const appendTo = this.document.querySelector(appendToSelector);
      if (!appendTo) {
        throw new Error(`Element ${appendToSelector} not found`);
      }
      appendTo.appendChild(this.pivot);
      appendTo.appendChild(this.blockOverlay);
    }
  }

  private next(): void {
    if (this.currentElement) {
      const index = this.filteredPath.indexOf(this.currentElement) + 1;
      this.currentElement = this.filteredPath[index];
      this.setFocused(this.currentElement);
      this.updateMenuContent();
    }
  }

  private previous(): void {
    if (this.currentElement) {
      const index = this.filteredPath.indexOf(this.currentElement) - 1;
      this.currentElement = this.filteredPath[index];
      this.setFocused(this.currentElement);
      this.updateMenuContent();
    }
  }

  public close(): void {
    if (this.currentElement) {
      const parent = this.pivot.parentElement!;
      parent.removeChild(this.pivot);
      parent.removeChild(this.blockOverlay);
      this.currentElement = null;
    }
  }

  private setFocused(pathEl: PathElement): void {
    // TODO: document.scrollingElement.overflow = 'overlay' ?
    if (!this.focus) {
      throw new Error('TODO');
    }
    const el = this.document.querySelector(pathEl.selector);
    if (!el) {
      throw new Error('TODO');
    }
    this.message.innerHTML = pathEl.message;
    const { borderRadius, padding } = {
      borderRadius: 0,
      padding: 0,
      ...this.config.defaultStyle,
      ...pathEl.style,
    };
    const { width, height } = el.getBoundingClientRect();
    this.focusInner.style.borderRadius = borderRadius + 'px';
    this.focusInner.style.padding = padding + 'px';
    this.focusInner.style.margin = -padding + 'px';
    this.focusInner.style.height = height + 'px';
    this.focusInner.style.width = width + 'px';
    this.setPivotPosition(el);
    this.scrollIntoElement(el); // TODO: menu?
    window.addEventListener('resize', () => {
      this.setPivotPosition(el);
      this.scrollIntoElement(el);
    });
  }

  private setPivotPosition(el: Element): void {
    const { top, left, right, bottom, width, height } = el.getBoundingClientRect();

    const bodyRect = this.document.body.getBoundingClientRect();
    const computedBodyStyle = window.getComputedStyle(this.document.body);
    const scrollX = -bodyRect.left + Number.parseInt(computedBodyStyle.marginLeft);
    const scrollY = -bodyRect.top + Number.parseInt(computedBodyStyle.marginTop);
    let posX: string;
    let posY: string;

    const ratio = width > height;

    const topHalf = scrollX + left < this.document.body.scrollWidth / 2;
    this.pivot.style.left = topHalf === ratio
      ? `${scrollX + left}px`
      : `${scrollX + right}px`;
    posX = topHalf ? 'left' : 'right';
    const leftHalf = scrollY + top < this.document.body.scrollHeight / 2;
    this.pivot.style.top = leftHalf === ratio
      ? `${scrollY + bottom}px`
      : `${scrollY + top}px`;
    posY = leftHalf ? 'top' : 'bottom';
    [
      'angular-app-hints__shadow-top-left',
      'angular-app-hints__shadow-top-right',
      'angular-app-hints__shadow-bottom-left',
      'angular-app-hints__shadow-bottom-right',
      'angular-app-hints__shadow-left-top',
      'angular-app-hints__shadow-left-bottom',
      'angular-app-hints__shadow-right-top',
      'angular-app-hints__shadow-right-bottom',
    ].forEach(i => this.focus.classList.remove(i));
    this.focus.classList.add(
      ratio
        ? `angular-app-hints__shadow-${posY}-${posX}`
        : `angular-app-hints__shadow-${posX}-${posY}`
    );
    [
      'angular-app-hints__menu-top-left',
      'angular-app-hints__menu-top-right',
      'angular-app-hints__menu-bottom-left',
      'angular-app-hints__menu-bottom-right',
      'angular-app-hints__menu-left-top',
      'angular-app-hints__menu-left-bottom',
      'angular-app-hints__menu-right-top',
      'angular-app-hints__menu-right-bottom',
    ].forEach(i => this.menu.classList.remove(i));
    this.menu.classList.add(
      ratio
        ? `angular-app-hints__menu-${posY}-${posX}`
        : `angular-app-hints__menu-${posX}-${posY}`
    );
  }

  private updateMenuContent(): void {
    if (!this.currentElement) {
      throw new Error('TODO');
    }
    const index = this.filteredPath.indexOf(this.currentElement);
    this.prevButton.style.display = index === 0 ? 'none' : 'block';
    const last = index === this.filteredPath.length - 1;
    this.nextButton.style.display = last ? 'none' : 'block';
    this.closeButton.style.display = !!this.currentElement.disableClose && !last
      ? 'none'
      : 'block';
  }

  private scrollIntoElement(el: Element): void {
    el.scrollIntoView(this.config.scrollIntoViewOptions);
  }
}
