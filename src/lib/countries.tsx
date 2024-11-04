export interface ICountry {
    name: string;
    country_code: number;
    preffix: string;
    url: string;
}

export const countries: ICountry[] = [
    {
        name: 'colombia', 
        country_code: 57, 
        preffix: 'CO',
        url: '/assets/imgs/countries/colombian-flag.png'
    }, {
        name: 'mexico', 
        country_code: 52, 
        preffix: 'MX', 
        url: '/assets/imgs/countries/mexican-flag.png'
    }
]