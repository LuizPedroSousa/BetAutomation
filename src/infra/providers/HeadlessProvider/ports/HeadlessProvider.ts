import { ClickDTO } from '../dtos/ClickDTO';
import { FillInputDTO } from '../dtos/FillInputDTO';
import { GetElementDTO } from '../dtos/GetElementDTO';
import { GetTextDTO } from '../dtos/GetTextDTO';
import { OpenPageDTO } from '../dtos/OpenPageDTO';
import { GoToDTO } from '../dtos/GoToDTO';
import { GetAttributeDTO } from '../dtos/GetAttributeDTO';

export interface HeadlessProvider {
  open(data?: OpenPageDTO): Promise<void>;
  goTo(data: GoToDTO): Promise<void>;
  togglePage(isPage: boolean): Promise<void>;
  click(data: ClickDTO): Promise<boolean>;
  fillInput(data: FillInputDTO): Promise<boolean>;
  getElement(data: GetElementDTO): Promise<boolean>;
  getAttribute(data: GetAttributeDTO): Promise<string>;
  getCookie(key: string): Promise<string>;
  getCookies(): Promise<{ [key: string]: any }>;
  setCookies(data: any[] | any): Promise<void>;
  reload(): Promise<void>;
  getText(data: GetTextDTO): Promise<string>;
  waitForPopUp(timeout?: number): Promise<void>;
  scroll(): Promise<void>;
  cleanPopUps(): Promise<void>;
}
