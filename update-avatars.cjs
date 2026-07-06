const fs = require('fs');

let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(
  /'https:\/\/ui-avatars.com\/api\/\?name=Siti\+Aminah&background=F472B6&color=fff'/g,
  "'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'"
);

data = data.replace(
  /'https:\/\/ui-avatars.com\/api\/\?name=Rina\+Kusuma&background=60A5FA&color=fff'/g,
  "'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'"
);

data = data.replace(
  /'https:\/\/ui-avatars.com\/api\/\?name=Dewi\+Lestari&background=34D399&color=fff'/g,
  "'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop'"
);

data = data.replace(
  /'https:\/\/ui-avatars.com\/api\/\?name=Ayu\+Wandira&background=FBBF24&color=fff'/g,
  "'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop'"
);

data = data.replace(
  /'https:\/\/ui-avatars.com\/api\/\?name=Pak\+Yanto&background=94A3B8&color=fff'/g,
  "'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'"
);

data = data.replace(
  /'https:\/\/ui-avatars.com\/api\/\?name=Bu\+Siti&background=A78BFA&color=fff'/g,
  "'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop'"
);

data = data.replace(
  /avatar: 'IR'/g,
  "avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'"
);

fs.writeFileSync('src/data.ts', data);
