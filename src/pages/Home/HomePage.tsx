import React, { ReactNodeArray, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from '../../api/axios';
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from 'react-toastify';
import './HomePage.scss';

import PageTemplate from '../../components/templates/PageTemplate';
import ImageSlider from '../../components/molecules/ImageSlider/ImageSlider';
import ProductCard from '../../components/organisms/ProductCard/ProductCard';
import { ProductModel } from '../../redux/cart/CartReducer';
import { useDispatch, useSelector } from 'react-redux';
import { addProductinToCart, addProductinToWishlist } from '../../redux/user/UserActions';
import { RootState } from '../../store';

import { heroBanner } from '../../assets/images';
import { showLoginModal } from '../../redux/loginModal/LoginModalActions';
import FullPageLoader from '../../components/atoms/fullPageLoader/FullPageLoader';
import AddToCartModal from '../../components/organisms/modals/AddToCartModal/AddToCardModal';



const HomePage = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const {formatMessage} = useIntl();
    
    const [productList, setProductList] = useState<ProductModel[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [showAddToCart, setShowAddToCart] = useState<boolean>(false);

    const userState = useSelector<RootState , RootState["userState"]>((state: RootState) => state.userState);
    const wishlistItems = useSelector<RootState, RootState["wishlistState"]>((state: RootState) => state.wishlistState).wishlistItems;
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const banners = [
        heroBanner
      ];
    const specialCategoriesKeys = ["knockout_deals", "festive_deals", "deals_of_day"];
    const fetchProductList= async () => {

        try{
            setShowLoader(true);
            const response = await axios.get("/products?_page=1&_limit=6");
            if(response.data) {
                setProductList(response.data);
            }
            setShowLoader(false);
        }catch(err){
            console.log(err)
        }
    }

    useEffect( () => {
        fetchProductList();
    }, []);

    function onViewAllClickHandler() {
        history.push('/offers/list');
    }

    function onProductCardClickHandler(productId: number) {
        history.push(`/item/${productId}`);
    }

    function renderBannerColumn() {
        return (
            <div className="bannerColumnContainer">
                <ImageSlider id="heroBanner" name="heroBanner" images={banners} style={{height: "500px"}}/>
            </div>
        );
    }

    function onAddToCartHandler(product: ProductModel){
        setSelectedProduct(product);
        setShowAddToCart(true);
    }

    function onAddtoCartClickHandler(size: string, color: string, quantity: number) {
        dispatch(addProductinToCart(Object.assign({}, selectedProduct, 
            {quantity, size, color})));
        
        toast(formatMessage({id: 'added_to_cart'}), {
            type: 'success'
        })
        setShowAddToCart(false);
    }

    function onBuyNowClickHandler(size: string, color: string, quantity: number) {
        if(!userState.isUserLoggedIn) {
            dispatch(showLoginModal(true));
            return;
        }
        if(userState.isUserLoggedIn && selectedProduct) {
            dispatch(addProductinToCart(Object.assign({}, selectedProduct, 
                {quantity, size, color})));
            history.push("/cart");
        }
    }


    const onAddToWishlistHandler = (product: ProductModel, isAddedInWishlist: boolean) => {
        
        isAddedInWishlist ? toast(formatMessage({id: 'remove_wishlist'}),
        {type: 'success'}) :
        toast(formatMessage({id: 'add_wishlist'}),
         {type: 'success'})

        dispatch(addProductinToWishlist(product));
    }


    const onAddToCartHide = () => {
        setShowAddToCart(false);
        setSelectedProduct(null);
    }
    
    //TODO: add 'listOfProductsByCategoryMap' as an arg, iterator through each item
    function renderProductListColumns() {
        const productListColumnRendererArray: ReactNodeArray = [];
        specialCategoriesKeys.forEach(element => {
            productListColumnRendererArray.push(
                <div className="productListColumnContainer" key={element}>
                    <div className="textBannerContainer">
                        <h4 className="textBannerTitle"><FormattedMessage id={element} /></h4>
                        <h4 
                            className="textBannerTitleLink"
                            onClick={() => onViewAllClickHandler()}
                        >
                            <FormattedMessage id="view_all" />
                        </h4>
                    </div>
                    <div className="productListContainer">
                        {   !showLoader && productList &&
                            productList.map((product: any) => {

                                const isAddedInWishlist = wishlistItems.filter(item => item.id === product.id).length > 0;
                                return (<ProductCard key={product.id}
                                    productTitle={product.name} 
                                    price={product.price} 
                                    isAddedInWishlist={isAddedInWishlist}
                                     onAddToWishlist={() => onAddToWishlistHandler(product, isAddedInWishlist)}
                                    discountPercent={product.discountPercent} 
                                    imgs={product.images} 
                                    addToCartHandler={(e) => onAddToCartHandler(product)}
                                    onClickHandler={(event: React.MouseEvent<Element, MouseEvent>) => {
                                        event.preventDefault();
                                        onProductCardClickHandler(product.id);
                                    }}
                                />)
                            })
                        }
                        { showLoader &&
                            <FullPageLoader/>
                        }
                    </div>
                </div>
            )
        });
        return productListColumnRendererArray;
    }

    function renderBody() {
        return (
            <div className="bodyComponent">
                {renderBannerColumn()}
                {renderProductListColumns()}
                <AddToCartModal 
                    show={showAddToCart}
                    onHide={onAddToCartHide}
                    onAddClick={onAddtoCartClickHandler}
                    onBuyNowClick={onBuyNowClickHandler}
                    />
            </div>
        )
    }


    return (
            <PageTemplate>
                {renderBody()}
            </PageTemplate>
    )
}

export default HomePage;
