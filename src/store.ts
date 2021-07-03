import wishlistState, { WishlistState } from './redux/wishlist/WishlistReducer';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import cartState, { CartState } from './redux/cart/CartReducer';

export type RootState = {
    cartState: CartState,
    wishlistState: WishlistState
}

const rootReducer = combineReducers({
    cartState,
    wishlistState
});

const middlewareEnhancer = applyMiddleware();

const saveStateToLocalStorage = (state: RootState) => {
    localStorage.setItem("state", JSON.stringify(state));
}

const loadStateFromLocalStorage = () => {
    const stateString = localStorage.getItem("state");
    return stateString ? JSON.parse(stateString) : undefined;
}

const persistedStore = loadStateFromLocalStorage();

export const store = createStore(rootReducer, persistedStore, middlewareEnhancer);

store.subscribe( () => {
    saveStateToLocalStorage(store.getState());
})
