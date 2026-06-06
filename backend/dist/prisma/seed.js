"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
const CATEGORIES = [
    '스낵',
    '초콜릿',
    '비스킷/쿠키',
    '빙과',
    '음료',
    '빵/케이크',
    '사탕/젤리',
];
const BRANDS = [
    '농심',
    '오리온',
    '롯데웰푸드',
    '빙그레',
    '해태',
    'GS25',
    'CU',
    '세븐일레븐',
    '이마트24',
];
const SNACKS = [
    {
        name: '누룽지팝 매콤한맛',
        brand: '농심',
        category: '스낵',
        price: 1800,
        releaseDate: new Date('2026-05-18'),
        description: '전통 간식 누룽지를 간편한 스낵으로 재해석. 고소한 누룽지에 고춧가루와 간장 시즈닝을 더한 매콤한 맛. 찹쌀로 만들어 바삭하면서도 부드럽게 부서지는 식감.',
    },
    {
        name: '망고킥',
        brand: '농심',
        category: '스낵',
        price: 1500,
        releaseDate: new Date('2026-05-01'),
        description: '애플망고의 진한 달콤함에 부드러운 우유 풍미를 더한 스낵. 바나나킥, 메론킥에 이은 킥 시리즈 세 번째 신제품.',
    },
    {
        name: '꼬북칩 말차초코맛',
        brand: '오리온',
        category: '스낵',
        price: 1800,
        releaseDate: new Date('2026-03-15'),
        description: '꼬북칩 브랜드의 한정판 말차초코맛. 네 겹으로 쌓인 바삭한 과자에 말차와 초콜릿의 조화.',
    },
    {
        name: '꼬북칩 바베큐&치미추리소스맛',
        brand: '오리온',
        category: '스낵',
        price: 1800,
        releaseDate: new Date('2026-05-10'),
        description: '유용욱바베큐연구소 콜라보. 꼬북칩 최초로 소스를 동봉한 제품. 훈연향과 메이플 시럽의 달콤한 풍미.',
    },
    {
        name: '쉘위 클래식',
        brand: '오리온',
        category: '빵/케이크',
        price: 6000,
        releaseDate: new Date('2026-03-10'),
        description: '생크림 26% 함량의 프리미엄 디저트 파이. 부드러운 크림을 채운 고급 파이로 50일 만에 1,000만 개 판매 돌파.',
    },
    {
        name: '쉘위 카카오',
        brand: '오리온',
        category: '빵/케이크',
        price: 6000,
        releaseDate: new Date('2026-03-10'),
        description: '진한 카카오 크림을 채운 프리미엄 디저트 파이. 쉘위 클래식의 카카오 버전.',
    },
    {
        name: '스트로베리 빼빼로',
        brand: '롯데웰푸드',
        category: '초콜릿',
        price: 1500,
        releaseDate: new Date('2026-04-01'),
        description: '딸기맛 초콜릿이 발라진 빼빼로 신제품. KBO 한국야구위원회 콜라보 한정 에디션.',
    },
    {
        name: '설레임 쿨리쉬 벨지안 초콜릿',
        brand: '롯데웰푸드',
        category: '빙과',
        price: 2000,
        releaseDate: new Date('2026-05-01'),
        description: '진한 벨지안 초콜릿 풍미에 미세 얼음을 더한 파우치형 아이스크림. 질소 충전 패키지로 손시림 48% 완화.',
    },
    {
        name: '설레임 쿨리쉬 멜론소다',
        brand: '롯데웰푸드',
        category: '빙과',
        price: 2000,
        releaseDate: new Date('2026-05-01'),
        description: '상큼한 멜론 소다 풍미의 파우치형 아이스크림. 질소 충전 패키지 적용으로 편리하게 즐기는 여름 간식.',
    },
    {
        name: '프리미엄 가나 쿠키 베리',
        brand: '롯데웰푸드',
        category: '초콜릿',
        price: 3500,
        releaseDate: new Date('2026-03-20'),
        description: '부드러운 버터 쿠키에 밀크 초콜릿과 트리플 베리 초콜릿을 입힌 볼 초콜릿. 4개의 레이어로 다양한 맛과 식감.',
    },
    {
        name: '추성훈 스무디 딸기바나나',
        brand: '세븐일레븐',
        category: '음료',
        price: 3000,
        releaseDate: new Date('2026-03-10'),
        description: '일본 세븐일레븐에서 인기를 얻은 즉석 스무디를 한국에 도입. 신선한 딸기와 바나나의 달콤한 조화.',
    },
    {
        name: '추성훈 스무디 망고',
        brand: '세븐일레븐',
        category: '음료',
        price: 3000,
        releaseDate: new Date('2026-03-10'),
        description: '진한 망고 과육을 갈아 만든 즉석 스무디. 열대과일의 달콤함을 편의점에서 간편하게.',
    },
    {
        name: '추성훈 스무디 베리요거트',
        brand: '세븐일레븐',
        category: '음료',
        price: 3000,
        releaseDate: new Date('2026-03-10'),
        description: '새콤달콤한 믹스베리와 부드러운 요거트를 블렌딩한 즉석 스무디.',
    },
    {
        name: '케일&파인 스무디',
        brand: '세븐일레븐',
        category: '음료',
        price: 3000,
        releaseDate: new Date('2026-06-04'),
        description: '국산 케일 27g에 사과, 파인애플, 당근 큐브를 배합한 건강 스무디. 70kcal 저칼로리.',
    },
    {
        name: '두바이 카다이프 쫀득볼',
        brand: 'GS25',
        category: '빵/케이크',
        price: 2500,
        releaseDate: new Date('2026-03-20'),
        description: '두바이 초콜릿 트렌드를 반영한 카다이프 실을 활용한 쫀득한 초콜릿 볼. 출시 두 달 만에 100만 개 판매 돌파.',
    },
    {
        name: '글루타치온 스트롱샷',
        brand: 'GS25',
        category: '음료',
        price: 4900,
        releaseDate: new Date('2026-03-06'),
        description: '리포좀 글루타치온 696mg, 비타민C RDA 300% 함유. 항산화 관리를 위한 이너뷰티 음료.',
    },
    {
        name: '마카다미아말차쿠키',
        brand: 'CU',
        category: '비스킷/쿠키',
        price: 2900,
        releaseDate: new Date('2026-04-15'),
        description: '고소한 마카다미아 너트와 은은한 말차 풍미의 조화. 바삭하면서도 촉촉한 프리미엄 쿠키.',
    },
    {
        name: '두바이 카다이프 크림빵',
        brand: 'CU',
        category: '빵/케이크',
        price: 3200,
        releaseDate: new Date('2026-03-15'),
        description: '편의점 최초의 두바이 스타일 크림빵. 초콜릿 스프레드와 피스타치오 크림을 풍성하게 채운 부드러운 빵.',
    },
    {
        name: '피스타치오 초코바',
        brand: 'CU',
        category: '초콜릿',
        price: 2200,
        releaseDate: new Date('2026-04-01'),
        description: '두바이 초콜릿 열풍을 반영한 피스타치오 크림 초코바. 진한 피스타치오 풍미와 밀크초콜릿의 조화.',
    },
    {
        name: '두바이 카다이프 쫀득모찌빵',
        brand: '이마트24',
        category: '빵/케이크',
        price: 3400,
        releaseDate: new Date('2026-03-20'),
        description: '두바이 카다이프 스타일의 쫀득한 모찌빵. 겉은 바삭하고 속은 촉촉한 이색 식감.',
    },
    {
        name: '흑임자크림 찹쌀도넛',
        brand: '이마트24',
        category: '빵/케이크',
        price: 1800,
        releaseDate: new Date('2026-04-10'),
        description: '고소한 흑임자 크림을 가득 채운 찹쌀 도넛. 쫀득한 찹쌀 반죽과 진한 흑임자의 풍미.',
    },
    {
        name: '비비빅 딸기아이스크림',
        brand: '빙그레',
        category: '빙과',
        price: 1800,
        releaseDate: new Date('2026-04-20'),
        description: '국민 아이스크림 비비빅의 딸기 맛 신제품. 새콤달콤한 딸기 과육이 가득 담긴 여름 한정 아이스크림.',
    },
    {
        name: '메로나 청포도',
        brand: '빙그레',
        category: '빙과',
        price: 1200,
        releaseDate: new Date('2026-05-15'),
        description: '메로나 브랜드의 청포도 맛 신제품. 상큼한 청포도 과즙을 담은 시원한 바 아이스크림.',
    },
    {
        name: '에이스 얼그레이크림',
        brand: '해태',
        category: '비스킷/쿠키',
        price: 2500,
        releaseDate: new Date('2026-03-25'),
        description: '국민 과자 에이스의 얼그레이 크림 협박 샌드 신제품. 홍차의 향긋함과 버터크림의 부드러움이 조화.',
    },
    {
        name: '홈런볼 말차크림',
        brand: '해태',
        category: '스낵',
        price: 1800,
        releaseDate: new Date('2026-04-05'),
        description: '속이 꽉 찬 홈런볼의 말차크림 신제품. 바삭한 초콜릿 외피와 달콤한 말차 크림의 조합.',
    },
    {
        name: '오예스 딸기',
        brand: '해태',
        category: '빵/케이크',
        price: 1800,
        releaseDate: new Date('2026-05-20'),
        description: '오예스 브랜드의 딸기 시즌 한정 신제품. 촉촉한 케이크 사이에 딸기 크림을 채운 프리미엄 간식.',
    },
];
async function main() {
    console.log('🌱 시드 데이터 삽입 시작...');
    const categoryMap = new Map();
    for (const name of CATEGORIES) {
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        categoryMap.set(name, cat.id);
    }
    console.log(`✅ 카테고리 ${CATEGORIES.length}개 생성 완료`);
    const brandMap = new Map();
    for (const name of BRANDS) {
        const brand = await prisma.brand.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        brandMap.set(name, brand.id);
    }
    console.log(`✅ 브랜드 ${BRANDS.length}개 생성 완료`);
    let count = 0;
    for (const snack of SNACKS) {
        const brandId = brandMap.get(snack.brand);
        const categoryId = categoryMap.get(snack.category);
        await prisma.snack.upsert({
            where: { name_brandId: { name: snack.name, brandId } },
            update: {
                description: snack.description,
                price: snack.price,
                releaseDate: snack.releaseDate,
                categoryId,
            },
            create: {
                name: snack.name,
                brandId,
                categoryId,
                description: snack.description,
                price: snack.price,
                releaseDate: snack.releaseDate,
            },
        });
        count++;
    }
    console.log(`✅ 과자 ${count}개 생성 완료`);
    console.log('🎉 시드 완료!');
}
main()
    .catch((e) => {
    console.error('❌ 시드 실패:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map