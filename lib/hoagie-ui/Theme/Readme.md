Theme Demonstration

```js
import Nav from '../Nav';
const user = {
    isLoading: false,
    user: {
        email: 'hoagie@princeton.edu',
        name: 'Tammy Tiger',
    },
};
const tabs = [
    { title: 'Buy', href: '/buy' },
    { title: 'Sell', href: '/sell' },
    { title: 'My Purchases', href: '/profile' },
];
<Theme palette='orange'>
    <Nav name='test' user={user} tabs={tabs} />
</Theme>;
```
