# Icons

This project uses [lucide-react](https://github.com/lucide-icons/lucide) for all UI icons. Import the `Icon` wrapper from `src/components/ui/Icon` and pass the icon name.

```tsx
import Icon from '../components/ui/Icon';

<Icon name="Trash2" />
```

Icons inherit the current text color. You can change the color using the `colorToken` prop which accepts a CSS variable name.

```tsx
<Icon name="AlertCircle" colorToken="--color-warning" />
```

Provide an `aria-label` when the icon conveys information. Decorative icons should remain hidden from assistive technology.

```tsx
<Button aria-label="Delete">
  <Icon name="Trash2" size="sm" />
</Button>
```
