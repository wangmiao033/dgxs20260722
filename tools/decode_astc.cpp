#include <astc-codec/astc-codec.h>

#include <cstdint>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

static uint32_t ReadU24(const uint8_t* p) {
  return static_cast<uint32_t>(p[0]) |
         (static_cast<uint32_t>(p[1]) << 8) |
         (static_cast<uint32_t>(p[2]) << 16);
}

int main(int argc, char** argv) {
  if (argc != 3) {
    std::cerr << "Usage: decode_astc input.astc output.rgba\n";
    return 2;
  }

  std::ifstream input(argv[1], std::ios::binary);
  if (!input) {
    std::cerr << "Cannot open input file\n";
    return 3;
  }
  std::vector<uint8_t> bytes((std::istreambuf_iterator<char>(input)),
                             std::istreambuf_iterator<char>());
  if (bytes.size() < 16 || bytes[0] != 0x13 || bytes[1] != 0xAB ||
      bytes[2] != 0xA1 || bytes[3] != 0x5C) {
    std::cerr << "Invalid ASTC header\n";
    return 4;
  }

  const uint8_t block_x = bytes[4];
  const uint8_t block_y = bytes[5];
  const uint32_t width = ReadU24(bytes.data() + 7);
  const uint32_t height = ReadU24(bytes.data() + 10);

  astc_codec::FootprintType footprint;
  if (block_x == 4 && block_y == 4) {
    footprint = astc_codec::FootprintType::k4x4;
  } else if (block_x == 5 && block_y == 5) {
    footprint = astc_codec::FootprintType::k5x5;
  } else if (block_x == 6 && block_y == 6) {
    footprint = astc_codec::FootprintType::k6x6;
  } else if (block_x == 8 && block_y == 8) {
    footprint = astc_codec::FootprintType::k8x8;
  } else if (block_x == 10 && block_y == 10) {
    footprint = astc_codec::FootprintType::k10x10;
  } else if (block_x == 12 && block_y == 12) {
    footprint = astc_codec::FootprintType::k12x12;
  } else {
    std::cerr << "Unsupported ASTC footprint: " << int(block_x) << "x"
              << int(block_y) << "\n";
    return 5;
  }

  const uint8_t* compressed = bytes.data() + 16;
  const size_t compressed_size = bytes.size() - 16;
  std::vector<uint8_t> rgba(static_cast<size_t>(width) * height * 4);
  const bool ok = astc_codec::ASTCDecompressToRGBA(
      compressed, compressed_size, width, height, footprint,
      rgba.data(), rgba.size(), static_cast<size_t>(width) * 4);
  if (!ok) {
    std::cerr << "ASTC decode failed\n";
    return 6;
  }

  std::ofstream output(argv[2], std::ios::binary);
  output.write(reinterpret_cast<const char*>(rgba.data()), rgba.size());
  if (!output) {
    std::cerr << "Cannot write output file\n";
    return 7;
  }

  std::cout << width << " " << height << "\n";
  return 0;
}
