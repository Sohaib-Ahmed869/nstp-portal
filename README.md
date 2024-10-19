# NSTP Portal

## How to run 
Type the following commands:
```bash
npm install
```
Then,
```bash
npm run dev
```

The frontend will be running on  http://localhost:5173/ 

Currently this project is using
* DaisyUI for theming and basic components
* HeroIcons by tailwind 

## Tips
To show toast, add this import
```
import showToast from '../util/toast';
```
Then in your api call code, add this function call (examples below)

*Using custom message*
```
showToast(false, 'An error occurred'); //Failure
showToast(true, 'That worked!'); //Success
```
*Using default message* 
```
showToast(false); //Failure Default msg: An error occurred. Please try later
showToast(true); //Success Default msg: Action completed successfully
```


