/*
 * Copyright (C) 2017-2018 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'hammerjs';
import 'mousetrap';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { ModalGalleryComponent } from './modal-gallery.component';
import { BackgroundComponent } from '../background/background.component';
import { CurrentImageComponent } from '../current-image/current-image.component';
import { LoadingSpinnerComponent } from '../current-image/loading-spinner/loading-spinner.component';
import { PreviewsComponent } from '../previews/previews.component';
import { UpperButtonsComponent } from '../upper-buttons/upper-buttons.component';
import { DotsComponent } from '../dots/dots.component';
import { PlainGalleryComponent } from '../plain-gallery/plain-gallery.component';
import { SlideConfig } from '../../model/slide-config.interface';
import { Size } from '../../model/size.interface';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { SizeDirective } from '../../directives/size.directive';
import { KeyboardNavigationDirective } from '../../directives/keyboard-navigation.directive';
import { ATagBgImageDirective } from '../../directives/a-tag-bg-image.directive';
import { WrapDirective } from '../../directives/wrap.directive';
import { DirectionDirective } from '../../directives/direction.directive';
import { KEYBOARD_CONFIGURATION, KeyboardService } from '../../services/keyboard.service';
import { KeyboardServiceConfig } from '../../model/keyboard-service-config.interface';

let comp: ModalGalleryComponent;
let fixture: ComponentFixture<ModalGalleryComponent>;

interface TestModel {
  currentImgTitle: string;
  currentAlt: string;
  currentDescription: string;
  leftPreviewTitle: string;
  leftPreviewAlt: string;
  rightPreviewTitle: string;
  rightPreviewAlt: string;
}

const TEST_MODEL: TestModel[] = [
  {
    currentImgTitle: 'Image 1/5',
    currentAlt: 'Image 1',
    currentDescription: 'Image 1/5',
    leftPreviewTitle: '',
    leftPreviewAlt: '',
    rightPreviewTitle: 'Image 2/5 - Description 2',
    rightPreviewAlt: 'Description 2'
  },
  {
    currentImgTitle: 'Image 2/5 - Description 2',
    currentAlt: 'Description 2',
    currentDescription: 'Image 2/5 - Description 2',
    leftPreviewTitle: 'Image 1/5',
    leftPreviewAlt: 'Image 1',
    rightPreviewTitle: 'Image 3/5 - Description 3',
    rightPreviewAlt: 'Description 3'
  },
  {
    currentImgTitle: 'Image 3/5 - Description 3',
    currentAlt: 'Description 3',
    currentDescription: 'Image 3/5 - Description 3',
    leftPreviewTitle: 'Image 2/5 - Description 2',
    leftPreviewAlt: 'Description 2',
    rightPreviewTitle: 'Image 4/5 - Description 4',
    rightPreviewAlt: 'Description 4'
  },
  {
    currentImgTitle: 'Image 4/5 - Description 4',
    currentAlt: 'Description 4',
    currentDescription: 'Image 4/5 - Description 4',
    leftPreviewTitle: 'Image 3/5 - Description 3',
    leftPreviewAlt: 'Description 3',
    rightPreviewTitle: 'Image 5/5',
    rightPreviewAlt: 'Image 5'
  },
  {
    currentImgTitle: 'Image 5/5',
    currentAlt: 'Image 5',
    currentDescription: 'Image 5/5',
    leftPreviewTitle: 'Image 4/5 - Description 4',
    leftPreviewAlt: 'Description 4',
    rightPreviewTitle: '',
    rightPreviewAlt: ''
  }
];

const TEST_MODEL_SINGLE_IMAGE: TestModel = TEST_MODEL[0];

const TEST_MODEL_INFINITE: TestModel[] = [
  {
    currentImgTitle: 'Image 1/5',
    currentAlt: 'Image 1',
    currentDescription: 'Image 1/5',
    leftPreviewTitle: 'Image 5/5',
    leftPreviewAlt: 'Image 5',
    rightPreviewTitle: 'Image 2/5 - Description 2',
    rightPreviewAlt: 'Description 2'
  },
  {
    currentImgTitle: 'Image 2/5 - Description 2',
    currentAlt: 'Description 2',
    currentDescription: 'Image 2/5 - Description 2',
    leftPreviewTitle: 'Image 1/5',
    leftPreviewAlt: 'Image 1',
    rightPreviewTitle: 'Image 3/5 - Description 3',
    rightPreviewAlt: 'Description 3'
  },
  {
    currentImgTitle: 'Image 3/5 - Description 3',
    currentAlt: 'Description 3',
    currentDescription: 'Image 3/5 - Description 3',
    leftPreviewTitle: 'Image 2/5 - Description 2',
    leftPreviewAlt: 'Description 2',
    rightPreviewTitle: 'Image 4/5 - Description 4',
    rightPreviewAlt: 'Description 4'
  },
  {
    currentImgTitle: 'Image 4/5 - Description 4',
    currentAlt: 'Description 4',
    currentDescription: 'Image 4/5 - Description 4',
    leftPreviewTitle: 'Image 3/5 - Description 3',
    leftPreviewAlt: 'Description 3',
    rightPreviewTitle: 'Image 5/5',
    rightPreviewAlt: 'Image 5'
  },
  {
    currentImgTitle: 'Image 5/5',
    currentAlt: 'Image 5',
    currentDescription: 'Image 5/5',
    leftPreviewTitle: 'Image 4/5 - Description 4',
    leftPreviewAlt: 'Description 4',
    rightPreviewTitle: 'Image 1/5',
    rightPreviewAlt: 'Image 1'
  }
];

const TEST_MODEL_ALWAYSEMPTY_DESCRIPTIONS: TestModel[] = [
  Object.assign({}, TEST_MODEL[0], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[1], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[2], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[3], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[4], {leftPreviewTitle: '', rightPreviewTitle: ''})
];

const TEST_MODEL_HIDEEMPTY_DESCRIPTIONS: TestModel[] = [
  Object.assign({}, TEST_MODEL[0], {
    currentImgTitle: '', leftPreviewTitle: '',
    rightPreviewTitle: 'Description 2', currentDescription: 'Image 1/5'
  }),
  Object.assign({}, TEST_MODEL[1], {
    currentImgTitle: 'Description 2', leftPreviewTitle: '',
    rightPreviewTitle: 'Description 3', currentDescription: 'Description 2'
  }),
  Object.assign({}, TEST_MODEL[2], {
    currentImgTitle: 'Description 3', leftPreviewTitle: 'Description 2',
    rightPreviewTitle: 'Description 4', currentDescription: 'Description 3'
  }),
  Object.assign({}, TEST_MODEL[3], {
    currentImgTitle: 'Description 4', leftPreviewTitle: 'Description 3',
    rightPreviewTitle: '', currentDescription: 'Description 4'
  }),
  Object.assign({}, TEST_MODEL[4], {
    currentImgTitle: '', leftPreviewTitle: 'Description 4',
    rightPreviewTitle: '', currentDescription: 'Image 5/5'
  })
];

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.mainContainerTitle = 'custom mainContainerTitle';
CUSTOM_ACCESSIBILITY.mainContainerAriaLabel = 'custom mainContainerAriaLabel';
CUSTOM_ACCESSIBILITY.mainNextImageTitle = 'custom mainNextImageTitle';
CUSTOM_ACCESSIBILITY.mainNextImageAriaLabel = 'custom mainNextImageAriaLabel';
CUSTOM_ACCESSIBILITY.mainPrevImageTitle = 'custom mainPrevImageTitle';
CUSTOM_ACCESSIBILITY.mainPrevImageAriaLabel = 'custom mainPrevImageAriaLabel';

const DEFAULT_SIZE: Size = {height: 'auto', width: '100px'};
const CUSTOM_SIZE: Size = {height: '100px', width: '100px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '100px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '100px', width: 'auto'};
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const CUSTOM_SLIDE_CONFIG: SlideConfig[] = [
  {infinite: false, sidePreviews: {show: true, size: CUSTOM_SIZE}},
  {infinite: false, sidePreviews: {show: true, size: CUSTOM_SIZE_AUTO_HEIGHT}},
  {infinite: false, sidePreviews: {show: true, size: CUSTOM_SIZE_AUTO_WIDTH}},
  {sidePreviews: {show: true, size: DEFAULT_SIZE}}
];

const CUSTOM_SLIDE_CONFIG_NO_SIDE_PREVIEWS: SlideConfig[] = [
  {infinite: false, sidePreviews: {show: false, size: DEFAULT_SIZE}},
  {infinite: true, sidePreviews: {show: false, size: DEFAULT_SIZE}},
  {sidePreviews: {show: false, size: DEFAULT_SIZE}},
  {infinite: true},
  {infinite: false}
];

const CUSTOM_SLIDE_CONFIG_INFINITE: SlideConfig[] = [
  {infinite: true, sidePreviews: {show: true, size: DEFAULT_SIZE}},
  {infinite: true, sidePreviews: {show: true, size: DEFAULT_SIZE}},
  {infinite: true, sidePreviews: {show: true, size: DEFAULT_SIZE}},
  {infinite: true}
];

const IMAGES: InternalLibImage[] = [
  new InternalLibImage(0, {
    // modal
    img: '../assets/images/gallery/img1.jpg',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(1, {
    // modal
    img: '../assets/images/gallery/img2.png',
    description: 'Description 2'
  }),
  new InternalLibImage(
    2,
    {
      // modal
      img: '../assets/images/gallery/img3.jpg',
      description: 'Description 3',
      extUrl: 'http://www.google.com'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img3.png',
      title: 'custom title 2',
      alt: 'custom alt 2',
      ariaLabel: 'arial label 2'
    }
  ),
  new InternalLibImage(3, {
    // modal
    img: '../assets/images/gallery/img4.jpg',
    description: 'Description 4',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(
    4,
    {
      // modal
      img: '../assets/images/gallery/img5.jpg'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img5.jpg'
    }
  )
];

function checkMainContainer() {
  const element: DebugElement = fixture.debugElement;
  const mainCurrentImage: DebugElement = element.query(By.css('main.main-image-container'));
  expect(mainCurrentImage.name).toBe('main');
  expect(mainCurrentImage.attributes['ksKeyboardNavigation']).toBe('');
  expect(mainCurrentImage.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainContainerTitle);
  expect(mainCurrentImage.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainContainerAriaLabel);
}

function checkCurrentImage(currentImage: InternalLibImage, val: TestModel, withDescription: boolean = true) {
  const element: DebugElement = fixture.debugElement;
  const currentFigure: DebugElement = element.query(By.css('figure#current-figure'));
  expect(currentFigure.name).toBe('figure');
  const currentImageElement: DebugElement = currentFigure.children[0];
  expect(currentImageElement.name).toBe('img');
  expect(currentImageElement.attributes['class']).toBe('inside');
  expect(currentImageElement.attributes['role']).toBe('img');
  expect(currentImageElement.properties['src']).toBe(currentImage.modal.img);
  expect(currentImageElement.properties['title']).toBe(withDescription ? val.currentImgTitle : '');
  expect(currentImageElement.properties['alt']).toBe(val.currentAlt);
  expect(currentImageElement.properties['tabIndex']).toBe(0);

  if (withDescription) {
    const currentFigcaption: DebugElement = currentFigure.children[1];
    expect(currentFigcaption.attributes['class']).toBe('inside description');
    expect(currentFigcaption.nativeElement.textContent).toEqual(val.currentDescription);
  }
}

function checkArrows(isFirstImage: boolean, isLastImage: boolean) {
  const element: DebugElement = fixture.debugElement;
  const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
  expect(aNavLeft.name).toBe('a');
  expect(aNavLeft.attributes['role']).toBe('button');
  expect(aNavLeft.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainPrevImageAriaLabel);
  expect(aNavLeft.properties['tabIndex']).toBe(isFirstImage ? -1 : 0);
  const divNavLeft: DebugElement = aNavLeft.children[0];
  expect(divNavLeft.attributes['aria-hidden']).toBe('true');
  expect(divNavLeft.properties['className']).toBe('inside ' + (isFirstImage ? 'empty-arrow-image' : 'left-arrow-image'));
  expect(divNavLeft.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainPrevImageTitle);

  const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
  expect(aNavRight.name).toBe('a');
  expect(aNavRight.attributes['role']).toBe('button');
  expect(aNavRight.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainNextImageAriaLabel);
  expect(aNavRight.properties['tabIndex']).toBe(isLastImage ? -1 : 0);
  const divNavRight: DebugElement = aNavRight.children[0];
  expect(divNavRight.attributes['aria-hidden']).toBe('true');
  expect(divNavRight.properties['className']).toBe('inside ' + (isLastImage ? 'empty-arrow-image' : 'right-arrow-image'));
  expect(divNavRight.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainNextImageTitle);
}

function checkSidePreviews(prevImage: InternalLibImage, nextImage: InternalLibImage,
                           isFirstImage: boolean, isLastImage: boolean, val: TestModel, size: Size = DEFAULT_SIZE) {
  const element: DebugElement = fixture.debugElement;
  const leftPreviewImage: DebugElement = element.query(By.css(isFirstImage
    ? 'div.current-image-previous.hidden'
    : 'img.inside.current-image-previous'));
  expect(leftPreviewImage.name).toBe(isFirstImage ? 'div' : 'img');
  expect(leftPreviewImage.attributes['ksSize']).toBe('');
  if (!isFirstImage) {
    expect(leftPreviewImage.properties['src']).toBe(prevImage.plain ? prevImage.plain.img : prevImage.modal.img);
    expect(leftPreviewImage.properties['title']).toBe(val.leftPreviewTitle);
    expect(leftPreviewImage.properties['alt']).toBe(val.leftPreviewAlt);
  }
  expect(leftPreviewImage.attributes['class']).toBe(isFirstImage ? 'current-image-previous hidden' : 'inside current-image-previous');
  expect(leftPreviewImage.styles.width).toBe(size.width);
  expect(leftPreviewImage.styles.height).toBe(size.height);

  const rightPreviewImage: DebugElement = element.query(By.css(isLastImage
    ? 'div.current-image-next.hidden'
    : 'img.inside.current-image-next'));
  expect(rightPreviewImage.name).toBe(isLastImage ? 'div' : 'img');
  expect(rightPreviewImage.attributes['ksSize']).toBe('');
  if (!isLastImage) {
    expect(rightPreviewImage.properties['src']).toBe(nextImage.plain ? nextImage.plain.img : nextImage.modal.img);
    expect(rightPreviewImage.properties['title']).toBe(val.rightPreviewTitle);
    expect(rightPreviewImage.properties['alt']).toBe(val.rightPreviewAlt);
  }
  expect(rightPreviewImage.attributes['class']).toBe(isLastImage ? 'current-image-next hidden' : 'inside current-image-next');
  expect(rightPreviewImage.styles.width).toBe(size.width);
  expect(rightPreviewImage.styles.height).toBe(size.height);
}

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [ModalGalleryComponent, ClickOutsideDirective, BackgroundComponent,
      UpperButtonsComponent, CurrentImageComponent, LoadingSpinnerComponent,
      DotsComponent, PlainGalleryComponent, PreviewsComponent,
      SizeDirective, KeyboardNavigationDirective, ATagBgImageDirective,
      WrapDirective, DirectionDirective]
  }).overrideComponent(ModalGalleryComponent, {
    set: {
      providers: [
        {
          provide: KeyboardService,
          useFactory: (injector: KeyboardServiceConfig) => new KeyboardService(injector),
          deps: [KEYBOARD_CONFIGURATION]
        },
        {
          provide: KEYBOARD_CONFIGURATION,
          useValue: {}
        }
      ]
    }
  });
}

describe('ModalGalleryComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGalleryComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display plain gallery, but not modal gallery`, () => {
      comp.modalImages = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES,
          currentValue: IMAGES,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).toBeNull();
      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery).not.toBeNull();
    });

    it(`should display modal gallery`, () => {
      comp.modalImages = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES,
          currentValue: IMAGES,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      comp.hasData.subscribe(val => {
        console.log('hasData', val);
      });

      comp.ngOnInit();
      const element: DebugElement = fixture.debugElement;

      comp.show.subscribe(val => {
        fixture.detectChanges();
        const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
        expect(modalGallery).not.toBeNull();
      });

      comp.showModalGallery(0);
    });

    // it(`should display current image with arrows and side previews when there is only one image.`, () => {
    //   comp.images = IMAGES;
    //   comp.currentImage = IMAGES[0];
    //   comp.isOpen = true;
    //   comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //   comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //   comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //   comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //   comp.keyboardConfig = null;
    //   comp.ngOnChanges(<SimpleChanges>{
    //     currentImage: {
    //       previousValue: IMAGES[0],
    //       currentValue: IMAGES[0],
    //       firstChange: false,
    //       isFirstChange: () => false
    //     }
    //   });
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //   checkMainContainer();
    //   checkCurrentImage(IMAGES[0], TEST_MODEL_SINGLE_IMAGE);
    // });
    //
    // TEST_MODEL.forEach((val: TestModel, index: number) => {
    //   it(`should navigate between images clicking on current image. Test i=${index}`, () => {
    //     comp.images = IMAGES;
    //     comp.currentImage = IMAGES[index];
    //     comp.isOpen = true;
    //     comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //     comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //     comp.keyboardConfig = null;
    //     comp.ngOnChanges(<SimpleChanges>{
    //       currentImage: {
    //         previousValue: IMAGES[index],
    //         currentValue: IMAGES[index],
    //         firstChange: false,
    //         isFirstChange: () => false
    //       }
    //     });
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     checkMainContainer();
    //     checkCurrentImage(IMAGES[index], val);
    //     checkArrows(index === 0, index === IMAGES.length - 1);
    //     checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);
    //
    //     const element: DebugElement = fixture.debugElement;
    //     const currentImage: DebugElement = element.query(By.css('img#current-image'));
    //     expect(currentImage.name).toBe('img');
    //
    //     if (index !== IMAGES.length - 1) {
    //       comp.changeImage.subscribe((res: ImageModalEvent) => {
    //         expect(res.result).toBe(index + 1);
    //         expect(res.action).toBe(Action.CLICK);
    //       });
    //
    //       currentImage.nativeElement.click();
    //     }
    //   });
    // });
    //
    // TEST_MODEL.forEach((val: TestModel, index: number) => {
    //   it(`should navigate between images clicking on right side preview. Test i=${index}`, () => {
    //     comp.images = IMAGES;
    //     comp.currentImage = IMAGES[index];
    //     comp.isOpen = true;
    //     comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //     comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //     comp.keyboardConfig = null;
    //     comp.ngOnChanges(<SimpleChanges>{
    //       currentImage: {
    //         previousValue: IMAGES[index],
    //         currentValue: IMAGES[index],
    //         firstChange: false,
    //         isFirstChange: () => false
    //       }
    //     });
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     checkMainContainer();
    //     checkCurrentImage(IMAGES[index], val);
    //     checkArrows(index === 0, index === IMAGES.length - 1);
    //     checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);
    //
    //     const element: DebugElement = fixture.debugElement;
    //     const rightPreviewImage: DebugElement = element.query(By.css(index === IMAGES.length - 1
    //       ? 'div.current-image-next.hidden'
    //       : 'img.inside.current-image-next'));
    //
    //     if (index !== IMAGES.length - 1) {
    //       comp.changeImage.subscribe((res: ImageModalEvent) => {
    //         expect(res.result).toBe(index + 1);
    //         expect(res.action).toBe(Action.CLICK);
    //       });
    //
    //       spyOn(comp, 'onNavigationEvent').and.callThrough();
    //
    //       rightPreviewImage.nativeElement.click();
    //     }
    //   });
    // });
    //
    //
    // [...TEST_MODEL].reverse().forEach((val: TestModel, index: number) => {
    //   it(`should navigate between images clicking on left side preview. Test i=${index}`, () => {
    //     const currentIndex: number = IMAGES.length - 1 - index;
    //     comp.images = IMAGES;
    //     comp.currentImage = IMAGES[currentIndex];
    //     comp.isOpen = true;
    //     comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //     comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //     comp.keyboardConfig = null;
    //     comp.ngOnChanges(<SimpleChanges>{
    //       currentImage: {
    //         previousValue: IMAGES[currentIndex],
    //         currentValue: IMAGES[currentIndex],
    //         firstChange: false,
    //         isFirstChange: () => false
    //       }
    //     });
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     checkMainContainer();
    //     checkCurrentImage(IMAGES[currentIndex], val);
    //     checkArrows(currentIndex === 0, currentIndex === IMAGES.length - 1);
    //     checkSidePreviews(IMAGES[currentIndex - 1], IMAGES[currentIndex + 1], currentIndex === 0, currentIndex === IMAGES.length - 1, val);
    //
    //     const element: DebugElement = fixture.debugElement;
    //     const leftPreviewImage: DebugElement = element.query(By.css(currentIndex === 0
    //       ? 'div.current-image-previous.hidden'
    //       : 'img.inside.current-image-previous'));
    //
    //     if (currentIndex !== 0) {
    //       comp.changeImage.subscribe((res: ImageModalEvent) => {
    //         expect(res.result).toBe(currentIndex - 1);
    //         expect(res.action).toBe(Action.CLICK);
    //       });
    //
    //       spyOn(comp, 'onNavigationEvent').and.callThrough();
    //
    //       leftPreviewImage.nativeElement.click();
    //     }
    //   });
    // });
    //
    // TEST_MODEL_ALWAYSEMPTY_DESCRIPTIONS.forEach((val: TestModel, index: number) => {
    //   it(`should display current image when description is ALWAYS_HIDDEN. Test i=${index}`, () => {
    //     comp.images = IMAGES;
    //     comp.currentImage = IMAGES[index];
    //     comp.isOpen = true;
    //     comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //     comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_HIDDEN};
    //     comp.keyboardConfig = null;
    //     comp.ngOnChanges(<SimpleChanges>{
    //       currentImage: {
    //         previousValue: IMAGES[index],
    //         currentValue: IMAGES[index],
    //         firstChange: false,
    //         isFirstChange: () => false
    //       }
    //     });
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     checkMainContainer();
    //     checkCurrentImage(IMAGES[index], val, false);
    //     checkArrows(index === 0, index === IMAGES.length - 1);
    //     checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);
    //   });
    // });
    //
    // TEST_MODEL_HIDEEMPTY_DESCRIPTIONS.forEach((val: TestModel, index: number) => {
    //   it(`should display current image when description is HIDE_IF_EMPTY. Test i=${index}`, () => {
    //     comp.images = IMAGES;
    //     comp.currentImage = IMAGES[index];
    //     comp.isOpen = true;
    //     comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //     comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.HIDE_IF_EMPTY};
    //     comp.keyboardConfig = null;
    //     comp.ngOnChanges(<SimpleChanges>{
    //       currentImage: {
    //         previousValue: IMAGES[index],
    //         currentValue: IMAGES[index],
    //         firstChange: false,
    //         isFirstChange: () => false
    //       }
    //     });
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     checkMainContainer();
    //     const imageWithoutDescription: boolean = !IMAGES[index].modal || !IMAGES[index].modal.description || IMAGES[index].modal.description === '';
    //     checkCurrentImage(IMAGES[index], val, !imageWithoutDescription);
    //     checkArrows(index === 0, index === IMAGES.length - 1);
    //     checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);
    //   });
    // });
    //
    // CUSTOM_SLIDE_CONFIG.forEach((slideConfig: SlideConfig, j: number) => {
    //   TEST_MODEL.forEach((val: TestModel, index: number) => {
    //     it(`should display current image, arrows and side previews with custom slideConfig. Test i=${index}, j=${j}`, () => {
    //       comp.images = IMAGES;
    //       comp.currentImage = IMAGES[index];
    //       comp.isOpen = true;
    //       comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //       comp.slideConfig = slideConfig;
    //       comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //       comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //       comp.keyboardConfig = null;
    //       comp.ngOnChanges(<SimpleChanges>{
    //         currentImage: {
    //           previousValue: IMAGES[index],
    //           currentValue: IMAGES[index],
    //           firstChange: false,
    //           isFirstChange: () => false
    //         }
    //       });
    //       comp.ngOnInit();
    //       fixture.detectChanges();
    //       checkMainContainer();
    //       checkCurrentImage(IMAGES[index], val);
    //       checkArrows(index === 0, index === IMAGES.length - 1);
    //       checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1],
    //         index === 0, index === IMAGES.length - 1,
    //         val, slideConfig.sidePreviews ? slideConfig.sidePreviews.size : DEFAULT_SIZE);
    //     });
    //   });
    // });
    //
    // CUSTOM_SLIDE_CONFIG_INFINITE.forEach((slideConfig: SlideConfig, j: number) => {
    //   TEST_MODEL_INFINITE.forEach((val: TestModel, index: number) => {
    //     it(`should display current image, arrows and side previews with infinite sliding. Test i=${index}, j=${j}`, () => {
    //       comp.images = IMAGES;
    //       comp.currentImage = IMAGES[index];
    //       comp.isOpen = true;
    //       comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //       comp.slideConfig = slideConfig;
    //       comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //       comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //       comp.keyboardConfig = null;
    //       comp.ngOnChanges(<SimpleChanges>{
    //         currentImage: {
    //           previousValue: IMAGES[index],
    //           currentValue: IMAGES[index],
    //           firstChange: false,
    //           isFirstChange: () => false
    //         }
    //       });
    //       comp.ngOnInit();
    //       fixture.detectChanges();
    //       checkMainContainer();
    //       checkCurrentImage(IMAGES[index], val);
    //       checkArrows((index === 0) && !slideConfig.infinite, (index === IMAGES.length - 1) && !slideConfig.infinite);
    //       if (slideConfig.sidePreviews) {
    //         checkSidePreviews(
    //           index === 0 ? IMAGES[IMAGES.length - 1] : IMAGES[index - 1],
    //           index === IMAGES.length - 1 ? IMAGES[0] : IMAGES[index + 1],
    //           (index === 0) && !slideConfig.infinite, (index === IMAGES.length - 1) && !slideConfig.infinite,
    //           val, slideConfig.sidePreviews ? slideConfig.sidePreviews.size : DEFAULT_SIZE);
    //       }
    //     });
    //   });
    // });
    //
    // CUSTOM_SLIDE_CONFIG_NO_SIDE_PREVIEWS.forEach((slideConfig: SlideConfig, j: number) => {
    //   TEST_MODEL_INFINITE.forEach((val: TestModel, index: number) => {
    //     it(`should display current image and arrows WITHOUT side previews. Test i=${index}, j=${j}`, () => {
    //       comp.images = IMAGES;
    //       comp.currentImage = IMAGES[index];
    //       comp.isOpen = true;
    //       comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //       comp.slideConfig = slideConfig;
    //       comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //       comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //       comp.keyboardConfig = null;
    //       comp.ngOnChanges(<SimpleChanges>{
    //         currentImage: {
    //           previousValue: IMAGES[index],
    //           currentValue: IMAGES[index],
    //           firstChange: false,
    //           isFirstChange: () => false
    //         }
    //       });
    //       comp.ngOnInit();
    //       fixture.detectChanges();
    //       checkMainContainer();
    //       checkCurrentImage(IMAGES[index], val);
    //       checkArrows((index === 0) && !slideConfig.infinite, (index === IMAGES.length - 1) && !slideConfig.infinite);
    //
    //       // no side previews
    //       const element: DebugElement = fixture.debugElement;
    //       const leftPreviewImage: DebugElement = element.query(By.css((index === 0) && !slideConfig.infinite
    //         ? 'div.current-image-previous.hidden'
    //         : 'img.inside.current-image-previous'));
    //       expect(leftPreviewImage).toBeNull();
    //       const rightPreviewImage: DebugElement = element.query(By.css((index === IMAGES.length - 1) && !slideConfig.infinite
    //         ? 'div.current-image-next.hidden'
    //         : 'img.inside.current-image-next'));
    //       expect(rightPreviewImage).toBeNull();
    //     });
    //   });
    // });
    //
    // it(`should display current image with custom accessibility`, () => {
    //   comp.images = IMAGES;
    //   comp.currentImage = IMAGES[0];
    //   comp.isOpen = true;
    //   comp.loadingConfig = <LoadingConfig>{enable: true, type: LoadingType.STANDARD};
    //   comp.slideConfig = <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}};
    //   comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
    //   comp.descriptionConfig = <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE};
    //   comp.keyboardConfig = null;
    //   comp.ngOnChanges(<SimpleChanges>{
    //     currentImage: {
    //       previousValue: IMAGES[0],
    //       currentValue: IMAGES[0],
    //       firstChange: false,
    //       isFirstChange: () => false
    //     }
    //   });
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //   const element: DebugElement = fixture.debugElement;
    //   const mainCurrentImage: DebugElement = element.query(By.css('main.main-image-container'));
    //   expect(mainCurrentImage.properties['title']).toBe(CUSTOM_ACCESSIBILITY.mainContainerTitle);
    //   expect(mainCurrentImage.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.mainContainerAriaLabel);
    //   const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
    //   expect(aNavLeft.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.mainPrevImageAriaLabel);
    //   expect(aNavLeft.children[0].properties['title']).toBe(CUSTOM_ACCESSIBILITY.mainPrevImageTitle);
    //   const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
    //   expect(aNavRight.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.mainNextImageAriaLabel);
    //   expect(aNavRight.children[0].properties['title']).toBe(CUSTOM_ACCESSIBILITY.mainNextImageTitle);
    // });
  });
});
