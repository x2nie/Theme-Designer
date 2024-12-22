data = '''Arizona=804000,FFFFFF,FFFFFF,O,-FFFFFF,O,808040,CoCOCO,FFFFFF,4080FF,COC0CO,0,818181
Bordeaux=400080,COC0C0,-FFFFFF,0,-FFFFF,0,800080,COCOCO,-FFFFFF,FF0080,COC0C0,0,818181
Designer=7C7C3F,COCOCO,-FFFFFF,0,-FFFFFF,0,808000,COCOC0,FFFFFF,400040,coc0Cc0,0,coc0Co
Fluorescent=0,FFFFFF,FFFFFF,0,FF00,0,fFOOFF,COCOCO,0,fF80,cococo,0,c0c0co
Monochrome=COCOCO,FFFFFF,FFFFFF,0,-FFFFFF,0,0,COCOCO,FFFFFF,808080,COC0C0,0,818181
Ocean=808000,408000,FFFFFF,0,-FFFFFF,0,804000,C1C1C1,FFFFFF,808080,FFFFFF,0,818181
Patchwork=9544BB,C1FBFA,FFFFFF,0,FFFFFF,0,FFF80,FFFFFF,0,64B14E,-FFFFFF,0,818181
Rugby=COoCOCdO,80FFFF,FFFFFF,0,-FFFFF,0,800000,-FFFFF,FFFFFF,80,-FFFFFF,0,818181
Pastel=COFF82,80FFFF,FFFFFF,0,FFFFF,0,FFFF80,FFFFF,0,CO8OFF,FFFFFF,808080,818181
Ving tips=408080,COCOCO,-FFFFFF,0,-FFFFFF,0,808080,-FFFFFF,FFFFFF,4080,FFFFFF,0,818181'''

themes = {}
for line in data.split('\n'):
    k,v = line.split('=')
    colors = []
    for c in v.split(','):
        c = c.lower()
        c = c.replace('-','')
        c = c.replace('o','0')
        c = c.replace('g','6')
        x =  int(c, 16)
        # it seem that win31 uses BGR and we need an RGB
        r =  x & 255
        g = (x >> 8) & 255
        b =   (x >> 16) & 255
        RGBint = (r<<16) + (g<<8) + b
        print(c, '=',x)
        # colors.append(x)
        colors.append(RGBint)
    themes[k] = colors
    # print(k, ','.join(str(colors)))

# for k,v in themes.items():
#     print(len(v), k, [hex(i).replace('0x','') for i in v])

for k,v in themes.items():
    # n = 0
    print(f'{k} {{')
    for n,i in enumerate(v):
        print(f'   --color-{n}: #{hex(i).replace('0x','') };')
    print('}')
