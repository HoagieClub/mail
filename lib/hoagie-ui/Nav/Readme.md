Standard Nav

```js
<Nav name='test' />
```

Nav with User Data

```js
const user = {
    isLoading: false,
    user: {
        email: 'hoagie@princeton.edu',
        name: 'Tammy Tiger',
        nickname: 'hoagie',
    },
};
<Nav name='test' user={user} />;
```

Nav with Tabs + Beta Disclaimer

```js
const tabs = [
    { title: 'Buy', href: '/buy' },
    { title: 'Sell', href: '/sell' },
    { title: 'My Purchases', href: '/profile' },
];
<Nav name='test' tabs={tabs} beta={true} />;
```
