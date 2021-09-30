import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type HintPosition = 'top' | 'bottom' | 'left' | 'right';

export interface PathElement {
  readonly selector: string;
  readonly message: string;
  readonly position?: HintPosition;
  readonly disableClose?: boolean;
  readonly style?: {
    readonly padding?: number;
    readonly borderRadius?: number;
  }
}

export interface AngularAppHintsConfig {
  readonly nextText: string;
  readonly prevText: string;
  readonly closeText: string;
  readonly closeOnEscape: boolean;
  readonly enableAnimations: boolean;
  readonly scrollIntoViewOptions: ScrollIntoViewOptions;
}

export type Path = PathElement[];

@Injectable({
  providedIn: 'root'
})
export class AngularAppHintsService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    // #region container
    this.container = this.document.createElement('div');
    this.container.classList.add('angular-app-hints__container');
    this.container.classList.add('angular-app-hints__container-animations');
    // #endregion

    // #region focus
    this.focus = this.document.createElement('div');
    this.focus.classList.add('angular-app-hints__shadow');
    this.container.appendChild(this.focus);

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
    this.container.appendChild(this.menu);

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
  private container: HTMLElement;
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
    this.container.classList.toggle(
      'angular-app-hints__container-animations',
      this.config.enableAnimations
    );
  }

  public go(): void {
    if (!this.currentElement) {
      this.currentElement = this.path[0];
      this.setFocused(this.currentElement);
      this.updateMenuContent();
      this.document.body.appendChild(this.container);
      this.document.body.appendChild(this.blockOverlay);
    }
  }

  private next(): void {
    if (this.currentElement) {
      const index = this.path.indexOf(this.currentElement) + 1;
      this.currentElement = this.path[index];
      this.setFocused(this.currentElement);
      this.updateMenuContent();
    }
  }

  private previous(): void {
    if (this.currentElement) {
      const index = this.path.indexOf(this.currentElement) - 1;
      this.currentElement = this.path[index];
      this.setFocused(this.currentElement);
      this.updateMenuContent();
    }
  }

  public close(): void {
    if (this.currentElement) {
      this.document.body.removeChild(this.container);
      this.document.body.removeChild(this.blockOverlay);
      this.currentElement = null;
    }
  }

  private setFocused(pathEl: PathElement): void {
    if (!this.focus) {
      throw new Error('TODO');
    }
    const el = this.document.querySelector(pathEl.selector);
    if (!el) {
      throw new Error('TODO');
    }
    this.message.innerHTML = pathEl.message;
    const borderRadius = pathEl.style?.borderRadius ?? 0;
    const padding = pathEl.style?.padding ?? 0;
    const { width, height } = el.getBoundingClientRect();
    this.focusInner.style.borderRadius = borderRadius + 'px';
    this.focusInner.style.padding = padding + 'px';
    this.focusInner.style.margin = -padding + 'px';
    this.focusInner.style.height = height + 'px';
    this.focusInner.style.width = width + 'px';
    this.setContainerPosition(el);
    this.scrollIntoElement(el);
    window.addEventListener('resize', () => this.setContainerPosition(el));
  }

  private setContainerPosition(el: Element): void {
    const { top, left, right, bottom } = el.getBoundingClientRect();

    const bodyRect = this.document.body.getBoundingClientRect();
    const computedBodyStyle = window.getComputedStyle(this.document.body);
    const scrollX = -bodyRect.left + Number.parseInt(computedBodyStyle.marginLeft);
    const scrollY = -bodyRect.top + Number.parseInt(computedBodyStyle.marginTop);
    let posX: string;
    let posY: string;

    if (scrollX + left < this.document.body.scrollWidth / 2) {
      this.container.style.left = `${scrollX + left}px`;
      posX = 'left';
    } else {
      this.container.style.left = `${scrollX + right}px`;
      posX = 'right';
    }
    if (scrollY + top < this.document.body.scrollHeight / 2) {
      this.container.style.top = `${scrollY + bottom}px`;
      posY = 'top';
    } else {
      this.container.style.top = `${scrollY + top}px`;
      posY = 'bottom';
    }
    [
      'angular-app-hints__shadow-top-left',
      'angular-app-hints__shadow-top-right',
      'angular-app-hints__shadow-bottom-left',
      'angular-app-hints__shadow-bottom-right',
    ].forEach(i => this.focus.classList.remove(i));
    this.focus.classList.add(`angular-app-hints__shadow-${posY}-${posX}`);
    [
      'angular-app-hints__menu-top-left',
      'angular-app-hints__menu-top-right',
      'angular-app-hints__menu-bottom-left',
      'angular-app-hints__menu-bottom-right',
    ].forEach(i => this.menu.classList.remove(i));
    this.menu.classList.add(`angular-app-hints__menu-${posY}-${posX}`);
  }

  private updateMenuContent(): void {
    if (!this.currentElement) {
      throw new Error('TODO');
    }
    const index = this.path.indexOf(this.currentElement);
    this.prevButton.style.display = index === 0 ? 'none' : 'block';
    const last = index === this.path.length - 1;
    this.nextButton.style.display = last ? 'none' : 'block';
    this.closeButton.style.display = !!this.currentElement.disableClose && !last
      ? 'none'
      : 'block';
  }

  private scrollIntoElement(el: Element): void {
    el.scrollIntoView(this.config.scrollIntoViewOptions);
  }
}
