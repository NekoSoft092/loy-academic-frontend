export interface IInit {
   getVersionWeb?: () => string; 
   getVersionDesktop?: () => Promise<string>;
}
