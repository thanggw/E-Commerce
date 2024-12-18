package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ColorResponse;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.dto.responses.SizeResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.exception.ResourceNotFoundException;
import com.t3h.e_commerce.mapper.BrandMapper;
import com.t3h.e_commerce.mapper.CategoryMapper;
import com.t3h.e_commerce.mapper.ProductMapper;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.IProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final ProductStatusRepository statusRepository;
    private final UserRepository userRepository;
    private final ColorRespository colorRepository;
    private final SizeRepository sizeRepository;
    @Value("${storage.root.folder.product}")
    private String storagePath;

    @Value("${storage.product.relative.path}")
    private String relativePath;

//    private  final ProductMapper2 productMapper;

    @Override
    public ResponsePage<ProductResponse> getAllProducts(ProductRequestFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Lấy dữ liệu từ repository với điều kiện filter và phân trang
        Page<ProductEntity> productEntityPage = productRepository.searchProductEntitiesByConditions(filter, pageable);

        // Chuyển đổi từ ProductEntity sang ProductResponse
        List<ProductResponse> productResponses = productEntityPage.getContent().stream()
                .map(ProductMapper::toProductResponse)
                .toList();

        // Tạo đối tượng ResponsePage với các thông tin phân trang
        ResponsePage<ProductResponse> responsePage = new ResponsePage<>();
        responsePage.setContent(productResponses);
        responsePage.setPageSize(productEntityPage.getSize());
        responsePage.setTotalElements(productEntityPage.getTotalElements());
        responsePage.setTotalPages(productEntityPage.getTotalPages());
        responsePage.setCurrentPage(productEntityPage.getNumber());  // Trực tiếp từ productEntityPage

        return responsePage;
    }

    @Override
    public List<ProductResponse> searchProductsByName(String name) {
        // Sử dụng repository để tìm kiếm sản phẩm theo tên gần đúng
        List<ProductEntity> products = productRepository.findByNameContainingIgnoreCase(name);

        // Chuyển đổi từ ProductEntity sang ProductResponse
        return products.stream()
                .map(ProductMapper::toProductResponse)
                .toList();
    }




    @Override
    public ProductResponse updateProduct(Integer id, ProductUpdateRequest request) {
       ProductEntity product = productRepository.findById(id)
               .orElseThrow(() -> CustomExceptionHandler.notFoundException("Product not found with id" +id));

       product.setName(request.getName());
    //   product.setImage(request.getImageUrl());
       product.setDescription(request.getDescription());
       product.setPrice(request.getPrice());
       product.setQuantity(request.getQuantity());
       product.setAvailable(request.getQuantity() == 0);
       product.setLastModifiedDate(LocalDateTime.now());

       productRepository.save(product);
        return ProductMapper.toProductResponse(product);
 }

    @Transactional
    public ProductEntity addProduct(ProductRequest request) {
        // Lấy thông tin người dùng từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Kiểm tra hoặc tạo Brand
        BrandEntity brand = brandRepository.findByCode(request.getBrandCode())
                .orElseGet(() -> {
                    BrandEntity newBrand = new BrandEntity();
                    newBrand.setCode(request.getBrandCode());
                    newBrand.setDescription("Mô tả cho brand " + request.getBrandCode()); // Thay bằng dữ liệu thực tế nếu có
                    return brandRepository.save(newBrand);
                });

        // Kiểm tra hoặc tạo Category
        CategoryEntity category = categoryRepository.findByCode(request.getCategoryCode())
                .orElseGet(() -> {
                    CategoryEntity newCategory = new CategoryEntity();
                    newCategory.setCode(request.getCategoryCode());
                    newCategory.setDescription("Mô tả cho category " + request.getCategoryCode()); // Thay bằng dữ liệu thực tế nếu có
                    return categoryRepository.save(newCategory);
                });

        // Tìm Color
        Set<Color> colors = request.getColors().stream()
                .map(name -> colorRepository.findByName(name)
                        .orElseGet(() -> {
                            // Tạo mới Color nếu không tồn tại
                            Color newColor = new Color();
                            newColor.setName(name);
                            return colorRepository.save(newColor);
                        }))
                .collect(Collectors.toSet());

        // Tìm Size
        Set<Size> sizes = request.getSizes().stream()
                .map(name -> sizeRepository.findByName(name)
                        .orElseGet(() -> {
                            // Tạo mới Size nếu không tồn tại
                            Size newSize = new Size();
                            newSize.setName(name);
                            return sizeRepository.save(newSize);
                        }))
                .collect(Collectors.toSet());

        // Tìm trạng thái sản phẩm
        ProductStatusEntity status = statusRepository.findByCode(request.getStatusCode())
                .orElseGet(() -> {
                    ProductStatusEntity newStatus = new ProductStatusEntity();
                    newStatus.setCode(request.getStatusCode());
                    newStatus.setDescription("Mô tả cho trạng thái " + request.getStatusCode());
                    return statusRepository.save(newStatus);
                });

        // Tạo ProductEntity
        ProductEntity product = new ProductEntity();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setColors(colors);
        product.setSizes(sizes);
        product.setBrand(brand);
        product.setCategory(category);
        product.setStatus(status);
        product.setUser(user);

        // Lưu ảnh từ Base64
        List<String> imagePaths = saveImagesFromBase64(request.getImageBase64s(), request.getName());
        Set<ProductImage> images = imagePaths.stream()
                .map(path -> {
                    ProductImage image = new ProductImage();
                    image.setImageUrl(path); // Lưu đường dẫn ảnh
                    image.setProduct(product);
                    image.setIsMain(false); // Logic xác định ảnh chính nếu cần
                    return image;
                }).collect(Collectors.toSet());

        product.setImages(images);

        return productRepository.save(product);
    }

    private List<String> saveImagesFromBase64(List<String> base64Images, String productName) {
        List<String> imagePaths = new ArrayList<>();

        for (String base64 : base64Images) {
            try {
                String mimeType = base64.substring(5, base64.indexOf(";"));
                String fileExtension = "";
                if ("image/png".equals(mimeType)) {
                    fileExtension = "png";
                }else if ("image/jpeg".equals(mimeType)) {
                    fileExtension = "jpg";
                } else if ("image/webp".equals(mimeType)) {
                    fileExtension = "webp";
                } else if ("image/gif".equals(mimeType)) {
                    fileExtension = "gif";
                }else {
                    throw new RuntimeException("Định dạng ảnh không được hỗ trợ: " + mimeType);
                }

                byte[] decodedBytes = Base64.getDecoder().decode(base64.split(",")[1]);
                if (!storagePath.endsWith("/")) {
                    storagePath += "/";
                }
                File directory = new File(storagePath);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                String fileName = "product_" + productName + "_" + UUID.randomUUID() + "." + fileExtension;
                File imageFile = new File(directory, fileName);
                try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                    fos.write(decodedBytes);
                }
                imagePaths.add(relativePath + fileName);
            } catch (Exception e) {
                for (String path : imagePaths) {
                    new File(storagePath + path).delete();
                }
                throw new RuntimeException("Lỗi khi lưu ảnh từ Base64: " + e.getMessage(), e);
            }
        }
        return imagePaths;
    }
    @Override
    public List<ProductResponse> getProductsByCurrentUser() {
        // Lấy tên người dùng hiện tại từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Tìm user trong database
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Tìm sản phẩm theo userId và chuyển đổi sang DTO
        return productRepository.findByUser_Id(user.getId()).stream()
                .map(product -> ProductResponse.builder()
                        .brand(BrandMapper.INSTANCE.toResponse(product.getBrand()))
                        .category(CategoryMapper.INSTANCE.toResponse(product.getCategory()))
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .description(product.getDescription())
                        .imageUrls(product.getImages().stream()
                                .map(ProductImage::getImageUrl)
                                .collect(Collectors.toList()))
                        .isSoldOut(product.getQuantity() <= 0)
                        .quantity(product.getQuantity())
                        .isAvailable(product.isAvailable())
                        .createdDate(product.getCreatedDate())
                        .createdBy(product.getCreatedBy())
                        .lastModifiedDate(product.getLastModifiedDate())
                        .lastModifiedBy(product.getLastModifiedBy())
                        .deleted(product.getDeleted())
                        .colors(product.getColors().stream()
                                .map(color -> new ColorResponse(color.getId(), color.getName()))
                                .collect(Collectors.toSet()))
                        .sizes(product.getSizes().stream()
                                .map(size -> new SizeResponse(size.getId(), size.getName()))
                                .collect(Collectors.toSet()))
                        .build())
                .collect(Collectors.toList());

    }


    @Override
    public ProductResponse getProductById(Integer id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        return ProductMapper.toProductResponse(productEntity);
    }

}
