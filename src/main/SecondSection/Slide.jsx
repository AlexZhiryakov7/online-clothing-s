import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteItemFromCart,
  setItemInCart,
  addNewTotalPrice,
  removeNewTotalPrice,
} from '../../redux/cart/reducer';
import { addInLiked } from '../../redux/cart/reducer';
import { Link } from 'react-router-dom';
import { HiOutlineHeart } from 'react-icons/hi2';
import { HiMiniHeart } from 'react-icons/hi2';
import { PiBagSimpleFill } from 'react-icons/pi'; // закрашенный
import { PiBagSimpleLight } from 'react-icons/pi'; // не закрашенный

function Slide({ item }) {
  const [listLiked, setListLiked] = useState([]);
  const dispatch = useDispatch();
  const {
    id,
    mark,
    img,
    name,
    price,
    oldPrice,
    sale,
    quantity,
    category,
    widthMark,
    imgSecond,
    imgThird,
    imgFour,
    size,
    color,
  } = item;

  const items = useSelector((state) => state.cart.itemsInCart);
  const liked = useSelector((state) => state.cart.liked);
  const newTotalPrice = useSelector((state) => state.cart.newTotalPrice);

  useEffect(() => {
    const getPrice = JSON.parse(localStorage.getItem('newTotalPrice'));
    let getListLiked = JSON.parse(localStorage.getItem('fillHeart'));

    if (getPrice === null) {
      localStorage.setItem('newTotalPrice', JSON.stringify([]));
      localStorage.setItem('itemList', JSON.stringify([]));
    }

    if (getListLiked === null) {
      getListLiked = [{ id, img, mark, name, price, oldPrice, sale, quantity, category, imgSecond, imgThird, imgFour, size, color, fillHeart: false }];
    } else {
      const existingItem = getListLiked.find(item => item.id === id);
      if (!existingItem) {
        getListLiked.push({ id, img, mark, name, price, oldPrice, sale, quantity, category, imgSecond, imgThird, imgFour, size, color, fillHeart: false });
      }
    }

    localStorage.setItem('fillHeart', JSON.stringify(getListLiked));
  }, []);

  const toggleLiked = () => {
    const getHearts = JSON.parse(localStorage.getItem('fillHeart'))
    const getID = getHearts[id]
    console.log(getID)
    if (getID.fillHeart) {
      const fillHeartObj =
        JSON.parse(localStorage.getItem('fillHeart')) || {};
      fillHeartObj[id] = { id, img, mark, name, price, oldPrice, widthMark, sale, quantity, category, imgSecond, imgThird, imgFour, size, color, fillHeart:false}
      localStorage.setItem('fillHeart', JSON.stringify(fillHeartObj));
      dispatch(addInLiked(id));
    } else {
      dispatch(addInLiked({ id, img, mark, name, price, oldPrice, sale, quantity, category, imgSecond, imgThird, imgFour, size, color }));
      const fillHeartObj =
        JSON.parse(localStorage.getItem('fillHeart')) || {};
      fillHeartObj[id] = { id, img, mark, name, price, widthMark, oldPrice, sale, quantity, category, imgSecond, imgThird, imgFour, size, color, fillHeart:true }
      localStorage.setItem('fillHeart', JSON.stringify(fillHeartObj));
    }
    // axios.get(`http://localhost:3393/liked?id=${id}`).then((data) => {
    //   const take = data.data.map((el) => {
    //     return el.id;
    //   });
    //   console.log(take[0]);
    //   const takeNumber = take[0];
    //   if (takeNumber != id) {
    //     axios
    //       .post('http://localhost:3393/liked', {
    //         name,
    //         id,
    //         mark,
    //         img,
    //         price,
    //         oldPrice,
    //         sale,
    //         quantity,
    //         fillHeart: true,
    //         widthMark,
    //         size,
    //         color,
    //         category,
    //         imgSecond,
    //         imgThird,
    //         imgFour,
    //       })
    //       .then((data) => {
    //         dispatch(addInLiked(data.data));
    //         const fillHeartObj =
    //           JSON.parse(localStorage.getItem('fillHeart')) || {};
    //         fillHeartObj[id] = true;
    //         localStorage.setItem('fillHeart', JSON.stringify(fillHeartObj));
    //       });
    //   } else {
    //     axios.delete(`http://localhost:3393/liked/${id}/`).then((data) => {
    //       console.log(data.data);
    //     });
    //     const fillHeartObj =
    //       JSON.parse(localStorage.getItem('fillHeart')) || {};
    //     fillHeartObj[id] = false;
    //     localStorage.setItem('fillHeart', JSON.stringify(fillHeartObj));
    //     dispatch(addInLiked(id));
    //   }
    // });
    // axios.get(`http://localhost:3393/liked?id=${id}`).then((data) => {
    //   console.log(data.data);
    // });
  };

  useEffect(() => {
    setListLiked(liked);
  }, [liked]);

  const checkFillFunc = (id) => {
    const fillHeartObj = JSON.parse(localStorage.getItem('fillHeart')) || {};
    if (fillHeartObj !== null && fillHeartObj[id] !== undefined) {
      return fillHeartObj[id].fillHeart
    }
  };

  useEffect(() => {
    if (newTotalPrice > 0) {
      const newTotalPrice = items.reduce(
        (acc, product) => (acc += product.price),
        0
      );
      localStorage.setItem('newTotalPrice', JSON.stringify(newTotalPrice));
    } else {
      null;
    }
  }, [items]);

  const handleClick = () => {
    const check = JSON.parse(localStorage.getItem(`${name}${size.first}`));
    const sizee = size.first;
    if (check !== null) {
      const getSize = JSON.parse(localStorage.getItem('selectedSize'));
      localStorage.setItem(
        'selectedSize',
        JSON.stringify([getSize, ...size.first])
      );
      localStorage.removeItem(`${name}${size.first}`);
      dispatch(removeNewTotalPrice({ name, sizee }));
      dispatch(deleteItemFromCart(id));

      const fillHeartObj = JSON.parse(localStorage.getItem('fillBag')) || {};
      const objectWithSize = {
        [size.first]: false,
      };
      fillHeartObj[id] = objectWithSize;
      localStorage.setItem('fillBag', JSON.stringify(fillHeartObj));
    } else {
      dispatch(
        setItemInCart({
          id,
          mark,
          img,
          name,
          price,
          oldPrice,
          sale,
          quantity,
          widthMark,
          color,
          size,
          category,
          imgSecond,
          imgThird,
          imgFour,
        })
      );
      const getSize = JSON.parse(localStorage.getItem('selectedSize'));
      localStorage.setItem(
        'selectedSize',
        JSON.stringify([getSize, ...size.first])
      );
      localStorage.setItem(
        String(`${name}${size.first}`),
        JSON.stringify({
          id,
          mark,
          img,
          name,
          price,
          oldPrice,
          sale,
          quantity,
          widthMark,
          color,
          size,
          category,
          imgSecond,
          imgThird,
          imgFour,
        })
      );
      dispatch(addNewTotalPrice({ name, price, sizee }));

      const fillHeartObj = JSON.parse(localStorage.getItem('fillBag')) || {};
      const objectWithSize = {
        [size.first]: true,
      };
      fillHeartObj[id] = {
        ...fillHeartObj[id],
        ...objectWithSize,
      };
      localStorage.setItem('fillBag', JSON.stringify(fillHeartObj));
    }
  };

  const checkFillBagFunc = (id) => {
    const fillHeartObj = JSON.parse(localStorage.getItem('fillBag')) || {};
    const getObj = fillHeartObj[id];
    if (getObj) {
      return getObj[size.first];
    } else {
      return false;
    }
  };

  const openProduct = () => {
    localStorage.setItem(
      'productDetails',
      JSON.stringify({
        id,
        mark,
        img,
        name,
        price,
        oldPrice,
        sale,
        quantity,
        category,
        imgSecond,
        imgThird,
        imgFour,
        size,
        color,
        widthMark
      })
    );
    const scroll = () => {
      const element = document.getElementById('Header');
      element.scrollIntoView({ behavior: 'smooth' });
    };
    scroll();
  };

  const bgStyle = {
    backgroundImage: `url(${img})`,
  };

  return (
    <div className="Slide">
      <div className="block">
        <Link
          className="bgImg"
          style={bgStyle}
          to={`/${id}`}
          onClick={() => openProduct()}
        >
          <div className="firstMark">
            <div
              className="mark"
              style={{
                backgroundImage: `url(${mark})`,
                width: widthMark,
              }}
            ></div>
          </div>
          <div className="addInfo">
            {checkFillFunc(id) ? (
              <HiMiniHeart
                className="heart"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLiked();
                }}
              />
            ) : (
              <HiOutlineHeart
                className="heart"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLiked();
                }}
              />
            )}
            {checkFillBagFunc(id) ? (
              <PiBagSimpleFill
                className="bag"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClick();
                }}
              />
            ) : (
              <PiBagSimpleLight
                className="bag"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClick();
                }}
              />
            )}
          </div>
        </Link>
        <div className="allBottomCard" id="allBottomCard">
          <div className="name">{name}</div>
          <div className="bottomInfo">
            <div className="price">
              {Intl.NumberFormat('ru-RU').format(price)} ₽
            </div>
            <del className="oldPrice">
              {Intl.NumberFormat('ru-RU').format(oldPrice)} ₽
            </del>
            <div
              className="sale"
              style={{
                backgroundImage: `url(${sale})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide;
